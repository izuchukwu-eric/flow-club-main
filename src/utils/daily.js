export function makeParticipantUpdateHandler(setParticipants) {
    return (ev) => {
        const participant = ev.participant
        if (ev.action === 'participant-left') {
            setParticipants(participants => {
                const newParticipants = { ...participants }
                delete newParticipants[participant.session_id]
                return newParticipants
            })
        } else {
            setParticipants(participants => ({
                ...participants,
                [participant.session_id]: dailyParticipantInfo(participant)
            }))
        }
    }
}

export function dailyParticipantInfo(participant) {
    return {
        name: participant.user_name,
        id: participant.session_id,
        joinedAt: participant.joined_at.valueOf(),
        isLocal: participant.local
    }
}