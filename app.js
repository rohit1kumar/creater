require('dotenv').config({ path: 'config/config.env' });

const express = require('express');
const app = express();
// const cors = require('cors');
// const helmet = require('helmet');
// const rateLimit = require('express-rate-limit');
// const YAML = require('yamljs');
// const swaggerUi = require('swagger-ui-express');
// const swaggerDocument = YAML.load('./swagger.yaml');
const cookieParser = require('cookie-parser');

const { errorMiddleware, notFound } = require('./middleware/error');
const { connectDB } = require('./config/db');

// router
const user = require('./routes/user');
const donation = require('./routes/donation');

// security middleware
// app.use(cors());
// app.use(helmet());
// app.use(rateLimit({
//     windowMs: 10 * 60 * 1000, // 10 minutes
//     max: 20 // limit each IP to 20 requests per windowMs
// }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.get('/', (req, res) => {
//     res.send('<p>Welcome to Pet API<br>Visit <a href="/docs">/docs</a> to see the API documentation</p>');
// });
// app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/api/v1/user', user);
app.use('/api/v1/donation', donation);

// loading error handler middleware
app.use(notFound);
app.use(errorMiddleware);

//  enviroment variables
const url = process.env.MONGO_URI || 'mongodb://localhost:27017/creator';
const port = process.env.PORT || 3000;

const startServer = async (url) => {
    try {
        await connectDB(url);
        console.log('Database connected successfully');
        app.listen(port, () => console.log(`Server is running on port ${port}`));
    } catch (err) {
        console.log(err.message);
        process.exit(1);
    }
};

startServer(url);