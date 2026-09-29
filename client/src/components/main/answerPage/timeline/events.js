const score = (post) =>
    (post.upvote || []).length - (post.downvote || []).length;

const commentEvent = (comment, answerId) => ({
    at: new Date(comment.com_date_time),
    what: "comment",
    action: "added",
    by: comment.com_by || "",
    comment: comment.text || "",
    answerId: answerId || "",
});

const timelineEvents = (question) => {
    if (!question || !question.ask_date_time) {
        return [];
    }

    const events = [
        {
            at: new Date(question.ask_date_time),
            what: "history",
            action: "asked",
            by: question.asked_by || "",
            comment: "",
        },
    ];

    for (const answer of question.answers || []) {
        events.push({
            at: new Date(answer.ans_date_time),
            what: "answer",
            action: "added",
            by: answer.ans_by || "",
            comment: `timeline score: ${score(answer)}`,
            answerId: answer._id,
        });
        for (const comment of answer.comments || []) {
            events.push(commentEvent(comment, answer._id));
        }
    }

    for (const comment of question.comments || []) {
        events.push(commentEvent(comment));
    }

    return events
        .filter((event) => !Number.isNaN(event.at.getTime()))
        .sort((a, b) => b.at - a.at);
};

const formatWhen = (date, absolute) => {
    if (absolute) {
        return date.toLocaleString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
        });
    }

    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) {
        return `${Math.max(seconds, 0)} seconds ago`;
    }
    if (seconds < 60 * 60) {
        return `${Math.floor(seconds / 60)} minutes ago`;
    }
    if (seconds < 60 * 60 * 24) {
        return `${Math.floor(seconds / 3600)} hours ago`;
    }
    if (seconds < 60 * 60 * 48) {
        return "yesterday";
    }
    return date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
};

const answerTimelineEvents = (answer) => {
    if (!answer || !answer.ans_date_time) {
        return [];
    }

    const events = [
        {
            at: new Date(answer.ans_date_time),
            what: "history",
            action: "answered",
            by: answer.ans_by || "",
            comment: `timeline score: ${score(answer)}`,
        },
    ];

    for (const comment of answer.comments || []) {
        events.push(commentEvent(comment));
    }

    return events
        .filter((event) => !Number.isNaN(event.at.getTime()))
        .sort((a, b) => b.at - a.at);
};

export { timelineEvents, answerTimelineEvents, formatWhen };
