# Path: docker/Dockerfile

# Gunakan image Node.js untuk environment development
FROM node:18 as development

# Set working directory
WORKDIR /app

# Salin file package.json dan package-lock.json ke container
COPY ../package*.json ./

# Install dependencies
RUN npm install

# Salin semua file ke working directory di container
COPY ../ .

# Jalankan prisma generate untuk membuat client prisma
RUN npx prisma generate

# Expose port yang digunakan oleh aplikasi (misalnya 3000)
EXPOSE 3000
EXPOSE 5555

# Perintah untuk menjalankan aplikasi
CMD ["npm", "run", "start:dev"]
