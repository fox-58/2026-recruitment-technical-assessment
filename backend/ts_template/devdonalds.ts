import express, { Request, Response } from "express";

// ==== Type Definitions, feel free to add or modify ==========================
interface cookbookEntry {
  name: string;
  type: string;
}

interface requiredItem {
  name: string;
  quantity: number;
}

interface recipe extends cookbookEntry {
  requiredItems: requiredItem[];
}

interface ingredient extends cookbookEntry {
  cookTime: number;
}

// =============================================================================
// ==== HTTP Endpoint Stubs ====================================================
// =============================================================================
const app = express();
app.use(express.json());

// Store your recipes here!
const cookbook: cookbookEntry[] = [];

// Task 1 helper (don't touch)
app.post("/parse", (req:Request, res:Response) => {
  const { input } = req.body;

  const parsed_string = parse_handwriting(input)
  if (parsed_string == null) {
    res.status(400).send("this string is cooked");
    return;
  } 
  res.json({ msg: parsed_string });
  return;
  
});

// [TASK 1] ====================================================================
// Takes in a recipeName and returns it in a form that 
const parse_handwriting = (recipeName: string): string | null => {
  let newRecipeName: string = recipeName
    // Repalce hyphens and underscores with whitespace (globally)
    .replace(/[_-]/g, ' ')
    // Remove all non letters / whitespace
    .replace(/[^a-zA-Z\s]/g, '')
    // Separate words by exaclty one whitesapce
    .split(/\s+/)
    .filter(word => word.length > 0)
    // Make capitals
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');

  if (newRecipeName.length == 0) {
    // Failed
    return null;
  }

  return newRecipeName;
}

// [TASK 2] ====================================================================
// Endpoint that adds a CookbookEntry to your magical cookbook
app.post("/entry", (req:Request, res:Response) => {
  const entry = req.body;


  if (entry.type !== "recipe" && entry.type !== "ingredient") {
    return res.status(400).send("You can only enter recipes or ingredients");
  }

  const exists = cookbook.some(item => item.name == entry.name);
  if (exists) {
    return res.status(400).send("This item already exists");
  }

  
  if (entry.type === "ingredient") {
    if (entry.cookTime && typeof entry.cookTime === 'number' && entry.cookTime < 0) {
      return res.status(400).send("I would love negative time to exist, do I get type by cooking this product?");
    }
  }
  
  cookbook.push(entry);
  return res.status(200).send();
});

// [TASK 3] ====================================================================
// Endpoint that returns a summary of a recipe that corresponds to a query name
app.get("/summary", (req:Request, res:Response) => {
  console.log('hi')
  const recipeName: string = req.query.name as string;

  const entry = cookbook.find(r => r.name === recipeName);

  if (!entry || entry.type !== "recipe") {
    return res.status(400).send("Returns a summary of a recipe");
  }

  try {
    const summary = buildRecipeSummary(entry as recipe);
    return res.status(200).json(summary);
  } catch {
    return res.status(400).send();
  }
});

const buildRecipeSummary = (recipeEntry: recipe) => {
  const ingredientsMap: Map<string, number> = new Map();
  let totalCookTime = 0;

  const recurse = (items: requiredItem[], numberOfItems: number) => {
    for (const item of items) {
      const entry = cookbook.find(e => e.name === item.name);

      if (!entry) {
        throw new Error();
      }

      if (entry.type === "ingredient") {
        totalCookTime += (entry as ingredient).cookTime * item.quantity * numberOfItems;
        const existingQty = ingredientsMap.get(entry.name) || 0;
        ingredientsMap.set(entry.name, existingQty + item.quantity * numberOfItems);

      } else if (entry.type === "recipe") {
        recurse((entry as recipe).requiredItems, item.quantity * numberOfItems);
        
      }
    }
  };

  recurse(recipeEntry.requiredItems, 1);

  const ingredientsArray = Array.from(ingredientsMap, ([name, quantity]) => ({
    name,
    quantity,
  }));

  return {
    name: recipeEntry.name,
    cookTime: totalCookTime,
    ingredients: ingredientsArray,
  };
};

// =============================================================================
// ==== DO NOT TOUCH ===========================================================
// =============================================================================
const port = 8080;
app.listen(port, () => {
  console.log(`Running on: http://127.0.0.1:8080`);
});
