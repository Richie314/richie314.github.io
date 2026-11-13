FROM ruby:3.3-slim-bookworm AS builder
RUN apt-get update -y && \
    apt-get install -y --no-install-recommends \
        build-essential \
        curl \
        git \
        imagemagick \
        inotify-tools \
        locales \
        nodejs \
        procps \
        python3-pip \
        zlib1g-dev
WORKDIR /app
COPY requirements.txt .
RUN pip --no-cache-dir install --upgrade --break-system-packages -r requirements.txt

RUN apt-get clean && \
    apt-get autoremove && \
    rm -rf /var/lib/apt/lists/* /var/cache/apt/archives/*  /tmp/*

RUN sed -i '/en_US.UTF-8/s/^# //g' /etc/locale.gen && \
    locale-gen
ENV EXECJS_RUNTIME=Node \
    JEKYLL_ENV=production \
    LANG=en_US.UTF-8 \
    LANGUAGE=en_US:en \
    LC_ALL=en_US.UTF-8
COPY Gemfile Gemfile.lock ./
# Install exactly the Bundler version recorded in the lockfile.
RUN gem install --no-document bundler --version "$(sed -n '/BUNDLED WITH/{n;s/^[[:space:]]*//;p;}' Gemfile.lock)"
ENV BUNDLE_FROZEN=true
RUN bundle install --no-cache

COPY . /app

RUN bundle exec jekyll build

FROM nginx
LABEL author="Riccardo Ciucci <riccardo@ciucci.dev>"
WORKDIR /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/_site/ .
