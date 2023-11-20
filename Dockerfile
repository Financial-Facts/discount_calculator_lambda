FROM public.ecr.aws/lambda/nodejs:18 as builder
WORKDIR /usr/app
COPY package.json tsconfig.json index.ts  ./
RUN mkdir src
COPY src ./src
RUN npm install
RUN npm run build

FROM public.ecr.aws/lambda/nodejs:18
WORKDIR ${LAMBDA_TASK_ROOT}
RUN mkdir node_modules
COPY --from=builder /usr/app/node_modules ./node_modules
COPY --from=builder /usr/app/dist/ ./
COPY --from=builder /usr/app/package.json ./
COPY --from=builder /usr/app/tsconfig.json ./
CMD ["index.handler"]