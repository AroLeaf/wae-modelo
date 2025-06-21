export async function fetchData(url) {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch(url, {
        headers: {
            'Authorization': token
        }
        })
        if (!response.ok) {
        console.error('fout bij ophalen data: ', response.statusText);
        return;
        }
        const data = await response.json();
        return data;

    } catch (err){
        console.error('fetch error', err);
    }
}
