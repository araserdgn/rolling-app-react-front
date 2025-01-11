import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { getPollById, castVote } from '../util/APIUtils';
import { Card, Radio, Button, Progress, notification } from 'antd';
import { Link } from 'react-router-dom';
import LoadingIndicator from '../common/LoadingIndicator';

export default function Poll() {
    const [poll, setPoll] = useState(null);
    const [selectedChoice, setSelectedChoice] = useState(null);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const { id } = useParams();

    const loadPoll = useCallback(() => {
        setLoading(true);
        getPollById(id)
            .then(response => {
                setPoll(response);
                if (response.selectedChoice) {
                    setSelectedChoice(response.selectedChoice.id);
                }
                setLoading(false);
            })
            .catch(error => {
                setLoading(false);
                notification.error({
                    message: 'Polling App',
                    description: error.message || 'Anket yüklenirken bir hata oluştu!'
                });
            });
    }, [id]);

    useEffect(() => {
        loadPoll();
    }, [loadPoll]);

    const handleVoteChange = (e) => {
        setSelectedChoice(e.target.value);
    };

    const handleVoteSubmit = () => {
        if (!selectedChoice) {
            notification.error({
                message: 'Polling App',
                description: 'Lütfen bir seçenek seçin!'
            });
            return;
        }

        setSubmitting(true);
        const voteData = { choiceId: selectedChoice };

        castVote(id, voteData)
            .then(response => {
                setPoll(response);
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
                setSubmitting(false);
            });
    };

    if (loading) {
        return <LoadingIndicator />;
    }

    if (!poll) {
        return null;
    }

    const calculatePercentage = (choice) => {
        if (poll.totalVotes === 0) return 0;
        return Math.round((choice.voteCount * 100) / poll.totalVotes);
    };

    const getTimeRemaining = () => {
        const expirationTime = new Date(poll.expirationDateTime).getTime();
        const now = new Date().getTime();
        
        if (now >= expirationTime) {
            return "Anket sona erdi";
        }

        const difference = expirationTime - now;
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

        if (days > 0) {
            return `${days} gün ${hours} saat kaldı`;
        }
        return `${hours} saat kaldı`;
    };

    return (
        <div className="poll-details">
            <Card
                title={poll.question}
                extra={
                    <Link to={`/users/${poll.createdBy.username}`}>
                        {poll.createdBy.name}
                    </Link>
                }
            >
                <div className="poll-choices">
                    {poll.selectedChoice ? (
                        // Sonuçları göster
                        poll.choices.map(choice => (
                            <div key={choice.id} className="poll-choice-result">
                                <span className="choice-text">{choice.text}</span>
                                <Progress
                                    percent={calculatePercentage(choice)}
                                    size="small"
                                    status={poll.selectedChoice.id === choice.id ? "success" : "normal"}
                                />
                                <span className="vote-count">
                                    {choice.voteCount} oy
                                    {poll.selectedChoice.id === choice.id && " (Sizin oyunuz)"}
                                </span>
                            </div>
                        ))
                    ) : (
                        // Oy verme formunu göster
                        <>
                            <Radio.Group
                                onChange={handleVoteChange}
                                value={selectedChoice}
                                className="poll-choice-radio-group"
                            >
                                {poll.choices.map(choice => (
                                    <Radio
                                        key={choice.id}
                                        value={choice.id}
                                        className="poll-choice-radio"
                                    >
                                        {choice.text}
                                    </Radio>
                                ))}
                            </Radio.Group>
                            <Button
                                type="primary"
                                onClick={handleVoteSubmit}
                                disabled={!selectedChoice || poll.expired}
                                loading={submitting}
                                className="vote-button"
                            >
                                Oy Ver
                            </Button>
                        </>
                    )}
                </div>
                <div className="poll-footer">
                    <span className="total-votes">
                        Toplam {poll.totalVotes} oy • {getTimeRemaining()}
                    </span>
                </div>
            </Card>
        </div>
    );
} 