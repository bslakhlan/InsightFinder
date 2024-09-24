export const relativeDataPointsPrompt = (customer_organization_info, customer_products_info, data_points, product_value_analysis) => `
You are a Senior Sales Leader tasked with analyzing your organization's products to identify key data points for sales reps to qualify and pitch these products. Use the provided information about your company, products, pain points, value propositions, and available data points to create your analysis.

Company Information: ${customer_organization_info}
Products: ${customer_products_info}
Product Pain Points and Value Propositions: ${product_value_analysis}
Available Data Points: ${data_points}

For each product, identify the relevant data points that sales reps should focus on. Explain how each data point helps in pitching the product and what actions the sales rep can take based on it. For numeric data points, explain what higher or lower values signify, or if there are important thresholds to consider.

Prioritize the most important data points first. If a data point is not relevant for a product, you may omit it.

Your output should be in the following JSON format:

{
  "product_name": [
    {
      "data_point": "Name of the data point",
      "relevance": "How this data point helps the seller and what action they can take based on it",
      "numeric_interpretation": "For numeric data points, explain what higher/lower values mean or if there are important thresholds (if applicable)"
    },
    // ... more data points for this product
  ],
  // ... more products
}

Do not add any other except the JSON in output, not even to inform that the answer is present. Just strictly give a JSON without any extra text.
`