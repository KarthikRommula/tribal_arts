# Tribal Arts E-commerce Platform

**Install dependencies:**

```bash
pnpm install
```

### Running the Application


```bash
pnpm dev
```

The application will be available at `http://localhost:3000`

### Database Seeding 

To populate the database with sample data, you can use the seed API endpoint:

- Make a POST request to `Invoke-WebRequest -Uri "http://localhost:3000/api/seed" -Method POST`


### Payment 

- Success - upiId: `success@razorpay`
- Fail -  upiId: `failure@razorpay`



### Admin 
- Username : `admin@tribalarts.com`
- Password : `admin123`