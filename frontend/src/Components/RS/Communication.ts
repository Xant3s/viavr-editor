export const getTemplates = async (preferences: any) => {

    const response = await fetch('http://localhost:5000/template', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(preferences)
    });
    return await response.json()

}

// Write getDataForAutoComplete without a parameter
export const getDataForAutoComplete = async () => {
    
    const response = await fetch('http://localhost:5000/autocomplete', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return await response.json()
}