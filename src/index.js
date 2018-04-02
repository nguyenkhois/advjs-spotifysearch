//Will import jQuery here. Don't forget it!!!
import $ from "jquery"

//Beginning for app
$(document).ready(function () {
   //Get HTML elements
    let slMarket = $("#slMarket");
    let slSearchBy = $("#slSearchBy");
    let txtSearchContent = $("#txtSearchContent");
    let btnSearch = $("#btnSearch");
    let btnAuth = $("#btnAuth");
    let dspSearchResults = $("#dspSearchResults");

   //Functions
    function getParamFromUrl(param){
        try{
            let sQueryString = document.URL.split("#")[1] || document.URL.split("?")[1];
            let searchParams = new URLSearchParams(sQueryString);

            if (searchParams.has(param))
                return searchParams.get(param);
            else
                return false;
        }catch(e){
            return false;
        }
    }
    function showTracks(objTracks) {
        console.log(objTracks);
        dspSearchResults.html(""); //Clear all data before render new data
        for(let i in objTracks.tracks.items){
            dspSearchResults.append(renderTrack(objTracks.tracks.items[i]));
        }
    }
    function renderTrack(objTrack) {
        let trackImage = objTrack.album.images[2].url;
        return `<article>
                    <img src="${trackImage}" alt="">
                    <p>Album type: ${objTrack.album.album_type}</p>
                    <p>Track name: ${objTrack.name}</p>
                    <p>Artist: ${objTrack.artists[0].name}</p>
                    <p><a href="${objTrack.external_urls.spotify}" target="_blank">Listen on Spotify</a></p>
                </article>`;
    }
    function showArtists(objArtists) {
        console.log(objArtists);
    }
    function showErrorMessages(objError) {
        console.log(objError);
    }

   //MAIN
    //-----Authorization the user-----
    let client_id = "a91bb3ab45564792a631d13655d609f5";
    let redirect_uri = encodeURIComponent("http://localhost:3000");
    let response_type = "token";
    let scopes = encodeURIComponent("user-read-private");
    let urlAuth = `https://accounts.spotify.com/en/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&response_type=${response_type}&scope=${scopes}`;

    //console.log(urlAuth);
    btnAuth.click(function () {
        $(location).attr('href', urlAuth);
    });
    //-----End of authorization the user-----

    btnSearch.click(function () {
        let searchMarket = slMarket.val();
        let searchBy = slSearchBy.val();
        let searchContent = encodeURIComponent(txtSearchContent.val());

        let urlSearch = `https://api.spotify.com/v1/search?q=${searchContent}&type=${searchBy}&market=${searchMarket}`;
        let accessToken = getParamFromUrl('access_token');
        console.log(urlSearch,accessToken);

        $.ajax({url: urlSearch,
            accepts: 'application/json',
            contentType: 'application/json',
            headers: {'Authorization': 'Bearer ' + accessToken},
            method: 'GET',
            success: function(result){
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
            },
            error: function (error) {
                showErrorMessages(error)
            }
        });
    });
});