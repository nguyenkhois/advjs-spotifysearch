//Beginning for app
//Get HTML elements
let slMarket = document.getElementById("slMarket");
let slSearchBy = document.getElementById("slSearchBy");
let txtSearchContent = document.getElementById("txtSearchContent");
let btnSearch = document.getElementById("btnSearch");
let btnAuth = document.getElementById("btnAuth");
let dspSearchResults = document.getElementById("dspSearchResults");
let imageNotFound = "images/imagenotfound.png";

//Functions
function getParamFromUrl(param){
    try{
        let sQueryString = document.URL.split("#")[1] || document.URL.split("?")[1];
        let searchParams = new URLSearchParams(sQueryString);

        if (searchParams.has(param))
            return searchParams.get(param);
        else
            return "";
    }catch(e){
        return e;
    }
}
function showTracks(objTracks) {
    console.log(objTracks);
    dspSearchResults.innerHTML = ""; //Clear all data before render new data
    try{
        for(let i in objTracks.tracks.items)
            dspSearchResults.appendChild(renderTrack(objTracks.tracks.items[i]));
    }catch (e){
        console.log(e);
    }
}
function renderTrack(objTrack) {
    let trackImage;
    objTrack.album.images.length > 2 ? trackImage = objTrack.album.images[2].url : trackImage = imageNotFound;
    let node = document.createElement("article");
    node.innerHTML = `<img src="${trackImage}" alt="" class="image">
                        <p>Album type: ${objTrack.album.album_type}</p>
                        <p>Track name: ${objTrack.name}</p>
                        <p>Artist: ${objTrack.artists[0].name}</p>
                        <p><a href="${objTrack.external_urls.spotify}" target="_blank">Listen on Spotify</a></p>`;
    return node;
}
function showArtists(objArtists) {
    console.log(objArtists);
    dspSearchResults.innerHTML = "";
    try {
        for(let i in objArtists.artists.items)
            dspSearchResults.append(renderArtist(objArtists.artists.items[i]));
    }catch (e){
        console.log(e);
    }
}
function renderArtist(objArtist) {
    let artistImage;
    objArtist.images.length > 2 ? artistImage = objArtist.images[2].url : artistImage = imageNotFound;
    let node = document.createElement("article");
    node.innerHTML = `<img src="${artistImage}" alt="" class="image">
            <p>Artist name: ${objArtist.name}</p>`;
    return node
}
function showErrorMessages(objError) {
    console.log(objError);
    dspSearchResults.innerHTML = "Data not found!";
}

//MAIN
//-----Authorization the user-----
let client_id = "YOUR_CLIENT_ID";
let redirect_uri = encodeURIComponent("YOUR_URI");

let response_type = "token";
let scopes = encodeURIComponent("user-read-private");
let urlAuth = `https://accounts.spotify.com/en/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&response_type=${response_type}&scope=${scopes}`;

let accessToken = getParamFromUrl('access_token') || "";
if (accessToken === ""){
    btnAuth.disabled = false;
    btnSearch.disabled = true;
}else{
    btnAuth.disabled = true;
    btnSearch.disabled = false;
}

btnAuth.addEventListener("click",event => {
    event.preventDefault();
    window.location.href = urlAuth;
});
//-----End of authorization the user-----

//-----Begin fetch from API-----
btnSearch.addEventListener("click",event => {
    event.preventDefault();

    let searchMarket = slMarket.value;
    let searchBy = slSearchBy.value;
    let searchContent = encodeURIComponent(txtSearchContent.value);
    let limit = 10;
    let urlSearch = `https://api.spotify.com/v1/search?q=${searchContent}&type=${searchBy}&market=${searchMarket}&limit=${limit}`;

    fetch(urlSearch,{
        method: 'GET',
        headers: new Headers({
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + accessToken
        })
    })
    .then(data=>{
        try{
            data.json().then(result=>{
                switch (searchBy){
                    case "track":
                        showTracks(result);
                        break;
                    case "artist":
                        showArtists(result);
                        break;
                    default:
                        break;
                }
            });
        }catch (error) {
            console.log(error);
        }
    })
    .catch(error=>{
        showErrorMessages(error);
    });
});
//-----End of fetch from API-----
