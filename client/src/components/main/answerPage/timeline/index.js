import { useState } from "react";
import { answerTimelineEvents, formatWhen, timelineEvents } from "./events";
import "./index.css";

const Timeline = ({ question, answer, handleProfile, onOpenAnswer }) => {
    const [absolute, setAbsolute] = useState(false);
    const events = answer ? answerTimelineEvents(answer) : timelineEvents(question);
    const heading = answer
        ? `Timeline for answer by ${answer.ans_by}`
        : `Timeline for ${question && question.title}`;

    return (
        <div id="timeline" className="timeline right_padding">
            <h2 className="timeline_title">{heading}</h2>
            <div className="timeline_count">{events.length} events</div>
            <table>
                <thead>
                    <tr>
                        <th>
                            when
                            <button
                                type="button"
                                className="timeline_toggle"
                                onClick={() => setAbsolute((current) => !current)}
                            >
                                toggle format
                            </button>
                        </th>
                        <th>what</th>
                        <th></th>
                        <th>by</th>
                        <th>comment</th>
                    </tr>
                </thead>
                <tbody>
                    {events.map((event, index) => (
                        <tr key={index}>
                            <td>{formatWhen(event.at, absolute)}</td>
                            <td>{event.what}</td>
                            <td>{event.action}</td>
                            <td>
                                {event.by && handleProfile ? (
                                    <button
                                        type="button"
                                        className="timeline_user"
                                        onClick={() => handleProfile(event.by)}
                                    >
                                        {event.by}
                                    </button>
                                ) : (
                                    event.by
                                )}
                            </td>
                            <td className="timeline_comment">
                                {event.comment}
                                {event.what === "comment" && event.answerId && onOpenAnswer && (
                                    <div>
                                        <a
                                            href="#answer-timeline"
                                            className="timeline_link"
                                            onClick={(click) => {
                                                click.preventDefault();
                                                onOpenAnswer(event.answerId);
                                            }}
                                        >
                                            timeline
                                        </a>
                                    </div>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Timeline;
