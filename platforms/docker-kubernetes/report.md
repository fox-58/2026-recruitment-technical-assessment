# Docker & Kubernetes Assessment Report

> [!TIP]
> Use this document to explain your design choices, optimisations and any challenges you faced.

## Dockerfile

1st challenge: how to write a dockerfile?
Watched some youtube: [1](https://www.youtube.com/watch?v=uPHLMlqNoEA) and [2](https://www.youtube.com/watch?v=k29FmUcihSA) 

2nd challenge: which image to use? https://hub.docker.com/_/node

Thoughts:
- I want lighweight and therefore will opt for slim variant (most likely)
- Looking at the package.json file looks like version 24 of node

This leeaves:
- 24-alpine, 24-bookworm-slim, 24-bullseye-slim
But, bullseye-slim seems to be used for legacy compatability.

Alpine, while being a small base has incompatabilities and size is not the most critical aspect of this dockerfile so I feel it might add extra unnecessary challenges. 

Final choice: 24-bookworm-slim
- Still on the smaller size
- Uses `glibc` so better compatability
(The more I learn the more I see alpine would work in this case, but I will leave it for now.)

Multistage: Multistage docker files are better for security and the size of the image, so I have gone with a multistage approach.Required learning what multistaging means : )

Security: after reading a bit more about docker files, namely [here](https://oneuptime.com/blog/post/2026-01-25-docker-container-user-permissions/view) I learnt a bit more about how to run them securely, so I will not run them from the root. I could write a script for the Entrypoint, but will not have time right now.  

Testing challenge; have the wrong version of pnpm installed. 

Also had issues with my corepack not working and it giving an error (forgot to write down the erorr) 

My changing to root directory seems to also not be working. I realised that I read the wrong sample code and was not using a line that works with a debian based system, so I have changed this line now. 

Overall: No clue if the dockerfile works properly, if any of it makes sense especially for the task, but I enjoyed learning the basics. But, when I built the docker it says successfully tagged at the end. 
<!-- TODO: (Optional) Explain any specific goals or design decisions -->

### Forked repository

<!-- TODO: If you submitted your changes to a fork, replace with your forked repository -->
`https://github.com/fox-58/2026-recruitment-technical-assessment`

## Kubernetes

<!-- TODO: Document your process for deploying Navidrome on Kubernetes -->
Did not get this done before the submission deadline, will work on this in the future hopefully.

Update: I watched a tutorial on minikube, had a few issues with downloading, but they all got solved fairly quickly. I just accidentally installed the wrong architecture.

Then, for the translate I used the command `kompose convert`. This did not work first time, however. I tried using a different sample yaml file found on the minikube website, and this worked so I knew it was not an issue with finding the file. 

As I copied and pasted the file, I did not thoroughly read it so initially thought the only issue was I did not fix the path names. 

I kept still getting the same error, and I realised that the `environment` section did not have a correctly formatted `key: value` pair that would be parsed correct. So, I changed the environment to empty and successfully converted the files into manifests.

Then came the issue of applying them locally. 
```inikube service navidrome                         
┌───────────┬───────────┬─────────────┬──────────────┐
│ NAMESPACE │   NAME    │ TARGET PORT │     URL      │
├───────────┼───────────┼─────────────┼──────────────┤
│ default   │ navidrome │             │ No node port │
└───────────┴───────────┴─────────────┴──────────────┘
😿  service default/navidrome has no node port
❗  Services [default/navidrome] have type "ClusterIP" not meant to be exposed, however for local development minikube allows you to access this !
```
So, I will need to port forward in order to access it. Doing this through kubectl, I successfully accessed the application locally. Yay!

