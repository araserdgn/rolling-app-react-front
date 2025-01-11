import React, { useState, useEffect, useCallback } from 'react';
import { getAllPolls, castVote, getUserCreatedPolls, getUserVotedPolls } from '../util/APIUtils';
import { Link } from 'react-router-dom';
import { Button, Card, Radio, notification } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

export default function PollList({ currentUser, username, type }) {
    const [polls, setPolls] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [size] = useState(10);
    const [hasMore, setHasMore] = useState(true);
    const [votes, setVotes] = useState({});
    const [loadingVotes, setLoadingVotes] = useState({});

    const loadPollList = useCallback((pageToLoad = 0) => {
        setLoading(true);
        let promise;

        if (username) {
            if (type === 'USER_CREATED_POLLS') {
                promise = getUserCreatedPolls(username, pageToLoad, size);
            } else if (type === 'USER_VOTED_POLLS') {
                promise = getUserVotedPolls(username, pageToLoad, size);
            }
        } else {
            promise = getAllPolls(pageToLoad, size);
        }

        promise
            .then(response => {
                const newPolls = pageToLoad === 0 
                    ? response.content 
                    : [...polls, ...response.content];
                setPolls(newPolls);
                setPage(pageToLoad + 1);
                setHasMore(!response.last);
                setLoading(false);
            })
            .catch(error => {
                setLoading(false);
                notification.error({
                    message: 'Polling App',
                    description: error.message || 'Anketler yüklenirken bir hata oluştu!'
                });
            });
    }, [username, type, size]);

    useEffect(() => {
        setPage(0);
        loadPollList(0);
    }, [loadPollList]);

    const handleVoteChange = (pollId, choiceId) => {
        setVotes({
            ...votes,
            [pollId]: choiceId
        });
    };

    const handleVoteSubmit = (pollId) => {
        if (!votes[pollId]) {
            notification.error({
                message: 'Polling App',
                description: 'Lütfen bir seçenek seçin!'
            });
            return;
        }

        setLoadingVotes({
            ...loadingVotes,
            [pollId]: true
        });

        const voteData = {
            choiceId: votes[pollId]
        };

        castVote(pollId, voteData)
            .then(response => {
                const updatedPolls = polls.map(poll => {
                    if (poll.id === pollId) {
                        return response;
                    }
                    return poll;
                });
                setPolls(updatedPolls);
                notification.success({
                    message: 'Polling App',
                    description: 'Oyunuz başarıyla kaydedildi!'
                });
            })
            .catch(error => {
                notification.error({
                    message: 'Polling App',
                    description: error.message || 'Oy verirken bir hata oluştu!'
                });
            })
            .finally(() => {
                setLoadingVotes({
                    ...loadingVotes,
                    [pollId]: false
                });
            });
    };

    const calculatePercentage = (choice, totalVotes) => {
        if (totalVotes === 0) return 0;
        return Math.round((choice.voteCount * 100) / totalVotes);
    };

    const handleLoadMore = () => {
        loadPollList(page);
    };

    return (
        <div className="polls-container">
            {polls.map(poll => (
                <Card
                    key={poll.id}
                    title={poll.question}
                    className="poll-card"
                    extra={
                        <Link to={`/users/${poll.createdBy.username}`}>
                            {poll.createdBy.name}
                        </Link>
                    }
                >
                    <Radio.Group
                        onChange={(e) => handleVoteChange(poll.id, e.target.value)}
                        value={votes[poll.id]}
                        className="poll-choices"
                    >
                        {poll.choices.map(choice => (
                            <Radio
                                key={choice.id}
                                value={choice.id}
                                className="poll-choice-radio"
                            >
                                {choice.text}
                                {poll.selectedChoice && (
                                    <span className="poll-choice-percent">
                                        {calculatePercentage(choice, poll.totalVotes)}%
                                    </span>
                                )}
                            </Radio>
                        ))}
                    </Radio.Group>

                    <div className="poll-footer">
                        {poll.selectedChoice ? (
                            <span className="total-votes">Toplam {poll.totalVotes} oy</span>
                        ) : (
                            <Button
                                type="primary"
                                onClick={() => handleVoteSubmit(poll.id)}
                                disabled={!votes[poll.id]}
                                loading={loadingVotes[poll.id]}
                            >
                                Oy Ver
                            </Button>
                        )}
                    </div>
                </Card>
            ))}

            {hasMore && !loading && (
                <div className="load-more-polls">
                    <Button onClick={handleLoadMore}>
                        Daha Fazla Yükle
                    </Button>
                </div>
            )}

            {loading && (
                <div className="poll-loading">
                    <LoadingOutlined />
                </div>
            )}
        </div>
    );
} 