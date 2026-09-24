import "./index.css";

const VotingButton = ({  }) => {
    return (
        <div>
            <button
                className="voting_button"
                onClick={() => {
                    // upvote();
                }}>
                ^
            </button>
            <div>
                0
            </div>
            <button
                className="voting_button"
                onClick={() => {
                    // upvote();
                }}>
                v
            </button>
        </div>
    )
}