export const getInitials = (str) => {
    if(!str)return "";

    const words = str.split(" ");

    let initials = "";

    for(var i=0; i<Math.min(words.length, 2); i++){
        initials += words[i][0];
    }

    return initials;
}