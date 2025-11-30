FROM node:18-alpine
RUN npm install -g pkg
RUN apk add --no-cache \
    git \
    python3 \
    make \
    g++ \
    pkgconfig \
    libc6-compat
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci
COPY . .
COPY build.sh .
RUN chmod +x build.sh
CMD ["./build.sh", "current"]
