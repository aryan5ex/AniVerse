const API = "https://api.jikan.moe/v4";

const animeGrid = document.getElementById("animeGrid");
const latestGrid = document.getElementById("latestGrid");
const search = document.getElementById("search");


/* =========================
   CREATE ANIME CARD
========================= */

function createAnimeCard(anime){

    const card = document.createElement("a");

    card.className = "card";

    card.href =
        "anime.html?id=" +
        anime.mal_id;


    card.dataset.name =
        (anime.title || "")
        .toLowerCase();


    const image =
        document.createElement("img");

    image.className = "poster";

    image.loading = "lazy";

    image.src =
        anime.images?.jpg
        ?.large_image_url ||
        anime.images?.jpg
        ?.image_url ||
        "";

    image.alt =
        anime.title || "Anime";


    const info =
        document.createElement("div");

    info.className = "card-info";


    const title =
        document.createElement("div");

    title.className = "card-title";

    title.textContent =
        anime.title ||
        "Unknown Anime";


    const meta =
        document.createElement("div");

    meta.className = "meta";

    meta.textContent =
        (anime.type || "TV") +
        " • " +
        (anime.episodes || "?") +
        " EP • " +
        (
            anime.score
            ? "★ " + anime.score
            : "N/A"
        );


    info.appendChild(title);

    info.appendChild(meta);

    card.appendChild(image);

    card.appendChild(info);


    return card;

}


/* =========================
   SHOW ANIME
========================= */

function showAnime(
    animeList,
    container
){

    if(!container){
        return;
    }


    container.innerHTML = "";


    if(
        !animeList ||
        animeList.length === 0
    ){

        container.innerHTML =
            '<div class="error">' +
            'No anime found.' +
            '</div>';

        return;

    }


    animeList.forEach(
        function(anime){

            container.appendChild(
                createAnimeCard(anime)
            );

        }
    );

}


/* =========================
   LOAD POPULAR
========================= */

async function loadPopular(){

    if(!animeGrid){
        return;
    }


    animeGrid.innerHTML =
        '<div class="loading">' +
        'Loading popular anime...' +
        '</div>';


    try{

        const response =
            await fetch(
                API +
                "/top/anime?limit=20"
            );


        if(!response.ok){
            throw new Error(
                "Popular API error"
            );
        }


        const result =
            await response.json();


        showAnime(
            result.data,
            animeGrid
        );


    }catch(error){

        console.log(error);

        animeGrid.innerHTML =
            '<div class="error">' +
            'Anime load nahi ho paaya.' +
            '<br><br>' +
            'Please refresh after a few seconds.' +
            '</div>';

    }

}


/* =========================
   LOAD LATEST
========================= */

async function loadLatest(){

    if(!latestGrid){
        return;
    }


    latestGrid.innerHTML =
        '<div class="loading">' +
        'Loading latest anime...' +
        '</div>';


    try{

        const response =
            await fetch(
                API +
                "/anime?order_by=popularity" +
                "&sort=asc&limit=20"
            );


        if(!response.ok){
            throw new Error(
                "Latest API error"
            );
        }


        const result =
            await response.json();


        showAnime(
            result.data,
            latestGrid
        );


    }catch(error){

        console.log(error);

        latestGrid.innerHTML =
            '<div class="error">' +
            'Latest anime load nahi ho paaya.' +
            '</div>';

    }

}


/* =========================
   SEARCH
========================= */

if(search){

    search.addEventListener(
        "input",
        function(){

            const text =
                search.value
                .toLowerCase()
                .trim();


            const cards =
                document.querySelectorAll(
                    ".card"
                );


            cards.forEach(
                function(card){

                    const name =
                        card.dataset.name ||
                        "";


                    if(
                        name.includes(text)
                    ){

                        card.style.display =
                            "block";

                    }else{

                        card.style.display =
                            "none";

                    }

                }
            );

        }
    );

}


/* =========================
   START
========================= */

loadPopular();

loadLatest();