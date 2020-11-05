const express = require('express');
const swaggerJsDocs = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');

const app = express();

const swaggerOptions = {
	definition: {
		info: {
			title: 'Customer API',
			description: 'Customer API Infomation',
			contact: {
				name: 'Amazing Developer'
			},
			servers: [ 'http://localhost:3002' ]
		}
	},
	apis: [ 'routersaccomodationPostRouter.js' ]
};

const swaggerDocs = swaggerJsDocs(swaggerOptions);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));

// Routes
/**
 * @swagger
 * /customers:
 *  get:
 *    description: Use to request all customers
 *    responses:
 *      '200':
 *        description: A successful response
 */
app.get('/customers', (req, res) => {
	res.status(200).send('Customer results');
});

/**
 * @swagger
 * /customer:
 *  put:
 *    description: Use to return all customers
 *    parameters:
 *    - name: customer
 *      in: query
 *      description: Name of our customer
 *      required: false
 *      schema:
 *        type: string
 *        format: string
 *    responses:
 *      '201':
 *        description: Successfully created user
 */

app.put('/customer', (req, res) => {
	res.status(200).send('Successfully updated customer');
});

app.listen(3002, () => console.log('>>> Server is running at port 3000'));
