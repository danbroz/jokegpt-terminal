const express = require('express');
const bodyParser = require('body-parser');
const { OpenAI } = require('openai');
const app = express();

const API_KEY = "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"; // Replace with your API key
const openai = new OpenAI({
    apiKey: API_KEY
});

app.use(bodyParser.json());
app.use(express.static('public'));  // To serve the frontend

app.post('/generate-jokes', async (req, res) => {
    const subject = req.body.subject;
    const frameworks = "These are the 13 Comedy Frameworks: Double Entendres framework is a simple play on words that have cliché takeoffs and reformations. The Reverses framework is a joke structure that infuses the element of surprise through the last-minute switch in assumption. Triple's framework is a 3-way joke structure buildup with tension, manipulation via two logical words or conditions driven towards an expected end, a third exaggeration that shatters this assumption. Incongruity framework is juxtaposing dissimilar elements. Simple Truth framework is a simple play on words that have cliché takeoffs and reformations but with phrases that imply truth in a comedic way. The Superiority framework lures the audience to feel superior through the self-deprecation of the comedian or through attacking people the audience feels inferior to like celebrities. The Paired Phrases framework uses the rhythms of the English lexicon, like antonyms, synonyms, or homonym. Slapstick framework infuses physical gestures into your jokes by acting out. The Observation-Recognition framework exaggerates simple everyday items, events or conditions that are easily recognizable by the audience. The compare and contrast framework operates by inducing surprise by starting out complex but finishing simple. The comedic Irony framework instills surprise with the representation of dramatic irony. The Benign Retaliation framework glamorizes comedic vengeance in a relatable way. The Paradox framework is self-contradictory and allows the audience to think inversely."
    const premise = "You are a funny comedian that doesn't ask questions.  You will be writting jokes about the premise: " + subject + ".  You will be using the 13 Comedy Frameworks and don't list the jokes with numbers or Framework type."


    let full = "";
    const completion = await openai.chat.completions.create({
        messages: [
            { "role": "system", "content": frameworks },
            { "role": "system", "content": premise },
            { "role": "user", "content": "write a standup set without asking questions or an introduction line." }
        ],
        model: 'gpt-4',
        stream: true,
    });

    for await (const part of completion) {
        let text = part.choices[0].delta.content ?? "";
        full += text;
    }
    
    res.send(full);
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});