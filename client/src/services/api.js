
const SERVER_PREFIX = "http://localhost:5000/api";

const Api = {
    fetchAllQuestions() {
        return fetch(`${SERVER_PREFIX}/questions`);
    },
    fetchAllQuestionTags() {
        return fetch(`${SERVER_PREFIX}/questions/tags`);
    },
    fetchQuestionsBySelectedTag(tag) {
        return fetch(`${SERVER_PREFIX}/questions/filter?tags=${tag}`);
    },
    registerUser(tiger) {
        return fetch(`${SERVER_PREFIX}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(tiger),
        });
    },
    loginUser(data) {
        return fetch(`${SERVER_PREFIX}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
    },
    fetchUserProfile(userId, username) {
        return fetch(`${SERVER_PREFIX}/users/${userId}/${username}`);
    },
    updateUserProfile(userId, userData, token) {
        return fetch(`${SERVER_PREFIX}/users/${userId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`, //or "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify(userData),
        });
    },
    changePassword(userId, currentPassword, newPassword, token) {
        return fetch(`${SERVER_PREFIX}/users/${userId}/change-password`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}` //or "Authorization": `Bearer ${localStorage.getItem("token")}`
          },
          body: JSON.stringify({ currentPassword, newPassword })
        });
    },
    postQuestion(questionData, token) {
        return fetch(`${SERVER_PREFIX}/questions`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}` //or "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify(questionData),
        });
    },
    fetchSingleQuestion(questionId) {
        return fetch(`${SERVER_PREFIX}/questions/${questionId}`);
    },
    fetchAnswersByQuestionId(questionId) {
        return fetch(`${SERVER_PREFIX}/questions/${questionId}/answers`);
    },
    postAnswer(questionId, answerData, token) {
        return fetch(`${SERVER_PREFIX}/questions/${questionId}/answer`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(answerData),
        });
    },
    upvoteQuestion(questionId, token) {
        return fetch(`${SERVER_PREFIX}/questions/${questionId}/upvote`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`, //or "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
        });
    },
    downvoteQuestion(questionId, token) {
        return fetch(`${SERVER_PREFIX}/questions/${questionId}/downvote`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`, //or "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
        });
    },
    upvoteAnswer(answerId, token) {
        return fetch(`${SERVER_PREFIX}/answers/${answerId}/upvote`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`, //or "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
        });
    },
    downvoteAnswer(answerId, token) {
        return fetch(`${SERVER_PREFIX}/answers/${answerId}/downvote`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`, //or "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
        });
    },
    editQuestion(questionId, updatedData, token) {
        return fetch(`${SERVER_PREFIX}/questions/${questionId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`, //or "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify(updatedData),
        })
    },
    deleteQuestion(questionId, token){
        return fetch(`${SERVER_PREFIX}/questions/${questionId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`, //or "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
        })
    },
    editAnswer(answerId, updatedData, token) {
        return fetch(`${SERVER_PREFIX}/answers/${answerId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`, //or "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify(updatedData),
        })
    },
    deleteAnswer(answerId, token){
        return fetch(`${SERVER_PREFIX}/answers/${answerId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`, //or "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
        })
    },
    incrementViewCount(questionId) {
        return fetch(`${SERVER_PREFIX}/questions/${questionId}/views`, {
          method: "PATCH",
        });
    },
    fetchSearchResults(query) {
        return fetch(`${SERVER_PREFIX}/search?q=${encodeURIComponent(query)}`);
    },
    fetchAllUsers() {
        return fetch(`${SERVER_PREFIX}/users`);
    },
      






};

export default Api;
