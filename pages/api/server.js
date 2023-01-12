import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// eslint-disable-next-line import/no-anonymous-default-export
export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message:
          "OpenAI API key not configured, please follow instructions in README.md",
      },
    });
    return;
  }

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

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(textInput),
      temperature: 0,
    });
    res.status(200).json({ result: completion.data.choices[0].text });
  } catch (error) {
    // Consider adjusting the error handling logic for your use case
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

function generatePrompt(textInput) {
  const capitalizedText =
    textInput[0].toUpperCase() + textInput.slice(1).toLowerCase();
  return `Suggest answers for the user input.
  
  textInput: Name three tourist attraction places in India?
  Names: The Taj Mahal, The Holy City of Varanasi, The Golden Temple of Amritsar.
  textInput: Which is most popular stack for web apps
  Names: MERN stack is very much popular stack.
  textInput: ${capitalizedText}
  Names:`;
}
