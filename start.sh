#!/bin/bash

cd backend
npm install

cd ../frontend
npm install
npm run build

cp -r dist/* ../backend/public/

cd ../backend
npm start