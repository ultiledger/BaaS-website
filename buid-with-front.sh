cd ../baas-ofiice-front;
npm run build;
cd ../baas-ofiice;
rm -rf dist;
cp -r ../baas-ofiice-front/dist ./public/;
npm run dev;
