import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// eslint-disable-next-line import/no-anonymous-default-export
export default async function (req, res) {
  // This functions check is api exist or not 
  // If not exist it will throw error
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message:
          "OpenAI API key not configured, please follow instructions in README.md",
      },
    });
    return;
  }

  //This function checks whether request body is empty or not
  //If there is no textInput than it will throw error
  const textInput = req.body.textInput || "";
  // console.log(textInput)
  if (textInput.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid Input",
      },
    });
    return;
  }


  // Main request to chat GPT here method we are using is createCompletion
  // defined model, propmt, and other properties
  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(textInput),
      max_tokens: 100,
      temperature: 1,
      n: 2
    });
    //taking the result from here and setting the status to 200
    res.status(200).json({ result: completion.data.choices[0].text });
    //here we will catch error if there are any and give output accordingly
  } catch (error) {
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: "An error occurred during your request.",
        },
      });
    }
  }
}

// this is genratePropmt function which takes input and we define here to our program/AI that what type of response we want
// the way we define here the way our AI will give responses accordingly
function generatePrompt(textInput) {
  const capitalizedText =
    textInput[0].toUpperCase() + textInput.slice(1).toLowerCase();
  return `Suggest answers for the user input.
  
  textInput: Name three tourist attraction places in India?
  Names: The Taj Mahal, The Holy City of Varanasi, The Golden Temple of Amritsar. These are the best places to visit in India.
  textInput: Which is most popular stack for web apps
  Names: MERN stands for MongoDB, Express, React, Node, after the four key technologies that make up the stack.

 1. MongoDB — document database
 2. Express(.js) — Node.js web framework
 3. React(.js) — a client-side JavaScript framework
 4. Node(.js) — the premier JavaScript web server
  
  textInput: ${capitalizedText}
  Names:`;
}
