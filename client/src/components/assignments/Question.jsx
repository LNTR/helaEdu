const Question = ({
  questionData,
  qIndex,
  handleQuestionChange,
  handleOptionChange,
  handleCorrectAnswerChange,
  handleMarksChange,
  removeQuestion,
}) => {
  return (
    <div className="mb-10">
      <div className="mb-10 flex justify-between">
        <h1 className="text-blue text-4xl">
          Question <span className="text-6xl">{qIndex + 1}</span>
        </h1>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded-xl text-2xl"
          onClick={() => removeQuestion(qIndex)}
        >
          Remove Question
        </button>
      </div>
      <div className="mx-10">
        <label className="text-3xl">Enter your question</label>
        <br />
        <br />
        <input
          className="border border-blue rounded-lg h-32 w-full px-4"
          value={questionData.question}
          onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
        />
      </div>
      <div className="mx-10 my-10">
        <label className="text-3xl">
          Enter your options
          <br />
          <span className="text-xl">
            Check all the correct answers for your question
          </span>
        </label>
        <br />
        <br />
        <div className="flex flex-wrap">
          {questionData.options.map((option, oIndex) => (
            <div
              key={oIndex}
              className="flex items-center space-x-4 w-1/2 mb-4"
            >
              <input
                type="checkbox"
                name={`correctAnswers-${qIndex}`}
                checked={questionData.correctAnswers.includes(option)}
                onChange={() => handleCorrectAnswerChange(qIndex, option)}
                className="checkbox border-blue h-10 w-10"
              />
              <input
                placeholder={`Option ${oIndex + 1}`}
                className="border border-blue rounded-lg h-16 w-11/12 text-xl px-4"
                value={option}
                onChange={(e) =>
                  handleOptionChange(qIndex, oIndex, e.target.value)
                }
                required
              />
            </div>
          ))}
        </div>
        <div className="my-10">
          <label className="text-3xl">Score</label>
          <br />
          <input
            type="number"
            min="0"
            className="border border-blue rounded-lg h-16 text-xl px-4"
            value={questionData.marks || ""}
            onChange={(e) => handleMarksChange(qIndex, e.target.value)}
            required
          />
        </div>
      </div>
    </div>
  );
};

export default Question;
