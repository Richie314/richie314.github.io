[![Riccardo Ciucci's personal website](readme_preview/banner.svg)](https://ciucci.dev)

<p align="center">
  <a href="https://ciucci.dev"><img src="https://img.shields.io/badge/Visit-ciucci.dev-38bdf8?style=flat-square" alt="Visit ciucci.dev"></a>
  <a href="https://github.com/Richie314/richie314.github.io/actions/workflows/deploy.yml"><img src="https://github.com/Richie314/richie314.github.io/actions/workflows/deploy.yml/badge.svg" alt="Deploy site workflow status"></a>
  <img src="https://img.shields.io/badge/Ruby-3.3-CC342D?style=flat-square&logo=ruby&logoColor=white" alt="Ruby 3.3">
  <img src="https://img.shields.io/badge/Built_with-Jekyll-CC0000?style=flat-square&logo=jekyll&logoColor=white" alt="Built with Jekyll">
  <img src="https://img.shields.io/badge/Preview-Docker-2496ED?style=flat-square&logo=docker&logoColor=white" alt="Docker preview">
</p>

This repository contains the source code and content for my personal website, **[ciucci.dev](https://ciucci.dev)**.

The site is built with **Jekyll**, based on the **[al-folio](https://github.com/alshedivat/al-folio)** theme, and published to GitHub Pages through GitHub Actions.

## Run locally with Docker

With Docker and Docker Compose installed, run from the repository root:

```sh
docker compose up --build -d
```

Open **[localhost](http://localhost)**. Docker builds the site and serves it with Nginx on port 80; Ruby and gems are installed inside the image. The first build can take a few minutes. Run the same command after editing files to rebuild the preview.

Stop the preview:

```sh
docker compose down
```

To use port 8080 instead:

```sh
docker build -t ciucci-site .
docker run --rm -p 8080:80 ciucci-site
```

Then open **[localhost:8080](http://localhost:8080)** and press `Ctrl+C` to stop.
