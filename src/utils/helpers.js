export const checkSession = async () => {
    const response = await fetch('http://localhost:8888/final-project-back-end/public/check-session.php', {
        credentials: 'include'
    });

    if (!response.ok) {
        throw new Error(`HTTP error! message: ${response.message}`);
    }

    return await response.json();
}

export const fetchCategories = async (setCategories) => {
    const response = await fetch('http://localhost:8888/final-project-back-end/public/category/get-categories.php', {
        method: "POST",
        mode: "cors",
        credentials: 'include'
    });

    if (!response.ok) {
        throw new Error(`HTTP error! message: ${response.message}`);
    }

    const data = await response.json();
    if (data.status === 'success') {
        setCategories(data.categories);
    } else {
        console.log('sth wrong');
    }
}