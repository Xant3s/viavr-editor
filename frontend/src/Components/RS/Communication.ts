export const getTemplates = async (preferences: any) => {

    const response = await fetch('http://localhost:5000/template', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(preferences)
    });
    const data = await response.json()
    return data

}