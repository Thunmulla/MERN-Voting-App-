const IsLoggedIn = () => {
    return !!sessionStorage.getItem('user')
}

const IsManager = () => {
    const user = JSON.parse(sessionStorage.getItem('user'));
    if (user) {
        return user.role === "Manager"
    } else {
        return false;
    }
}

export {IsLoggedIn, IsManager}