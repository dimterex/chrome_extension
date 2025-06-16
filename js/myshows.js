(function() {
    "use strict";

    function download_page() {
        // ToDo:
        // 3. Подумать убрать статус "В процессе"

        function formatBytes(bytes, decimals = 2) {
            if (bytes === 0) {
                return '0';
            } else {
                var k = 1024;
                var dm = decimals < 0 ? 0 : decimals;
                var sizes = ['байт', 'КБ', 'МБ', 'ГБ', 'ТБ'];
                var i = Math.floor(Math.log(bytes) / Math.log(k));
                return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
            }
        }


        var unwatched_list = document.querySelectorAll('div.Unwatched-show');
        var ANILIBRIA_URL = "https://anilibria.top/anime/releases/release";
        var ANILIBRITA_TORRENTS_ENDPOINT = "torrents";

        // API
        var ANILIBRIA_SEARCH_QUERY_ENDPOINT = "https://anilibria.top/api/v1/app/search/releases?query=";
        var ANILIBRIA_TORRENTS_RELEASE_INFO_ENDPOINT = "https://anilibria.top/api/v1/anime/torrents/release";
        var ANILIBRIA_TORRENTS_DOWNLOAD_ENDPOINT = `https://anilibria.top/api/v1/anime/torrents`;

        var result_html = "";
        var counter = 0;

        unwatched_list.forEach(element => {
            var title = element.querySelector('span.Unwatched-showTitle-title').innerText;
            var serach_request = new XMLHttpRequest();
            serach_request.open( "GET", `${ANILIBRIA_SEARCH_QUERY_ENDPOINT}${title}`, false );
            serach_request.send( null );
            var serach_response = JSON.parse(serach_request.responseText);
            
            result_html += `
                <div class="wrap-collabsible"> 
                    <input id="collapsible${counter}" class="toggle" type="checkbox">
                    <label for="collapsible${counter}" class="custom-collapsible-button">${title}</label>
                    <div class="collapsible-content">
                        <div class="content-inner">
           
            `;
            counter += 1;
            var nestedTableHTML = `           
            <table style="border-collapse: collapse; width: 100%;" border="1">
                <tbody>
                    <tr>
                        <td>Ссылка</td>
                        <td>Статус</td>
                        <td>Всего эпизодов</td>
                        <td>Эпизодов в файле</td>
                        <td>Дата последнего обновления</td>
                        <td>Кодек</td>
                        <td>Размер</td>
                        <td>Файл торрента</td>
                    </tr>
            `;


        if (serach_response.length > 0) {
            serach_response.forEach(item => {
                var release_id = item["id"];
                var torrents_info_request = new XMLHttpRequest();
                torrents_info_request.open( "GET", `${ANILIBRIA_TORRENTS_RELEASE_INFO_ENDPOINT}/${release_id}`, false );
                torrents_info_request.send( null );
                var torrents_info_response = JSON.parse(torrents_info_request.responseText);
                
                var torrentPage = `${ANILIBRIA_URL}/${item["alias"]}/${ANILIBRITA_TORRENTS_ENDPOINT}`;
                var name = item["name"]["main"];

                var status = item["is_ongoing"] ? "В процессе" : "Завершено";
                var episodesTotal = item["episodes_total"];
               
                torrents_info_response.forEach(torrent_info => {
                    var codec_value = torrent_info["codec"]["value"];
                    var size_value = formatBytes(torrent_info["size"]);
                    var description_value = torrent_info["description"];
                    var last_update_date_value = torrent_info["updated_at"];
                    var torrent_hash_value = torrent_info["hash"];
                    var download_torrent_url = `${ANILIBRIA_TORRENTS_DOWNLOAD_ENDPOINT}/${torrent_hash_value}/file`

                    nestedTableHTML += `
                    <tr>
                        <td>
                            <p><a href="${torrentPage}" target="_blank">${name}</a></p>
                        </td>
                        <td>${status}</td>
                        <td>${episodesTotal}</td>
                        <td>${description_value}</td>
                        <td>${last_update_date_value}</td>
                        <td>${codec_value}</td>
                        <td>${size_value}</td>
                         <td>
                            <p><a href="${download_torrent_url}" target="_blank">Скачать файл</a></p>
                        </td>
                    </tr>
                `;
                });
 
            });
        } else {
            nestedTableHTML += `
                <tr>
                    <td colspan="8">No data found</td>
                </tr>
            `;
        }

        nestedTableHTML += `
                </tbody>
            </table>
        `;

        result_html += nestedTableHTML + `
        
                    </div>
                </div>
            </div>
        `;
        });

         var event = new CustomEvent("custom_event", {
                    detail: {
                        event_type: "open_window",
                        content: result_html,
                        win_name: "download_page",
                    }
                });
        document.dispatchEvent(event);
    }


    registerSite(/^https?:\/\/myshows.*$/, [{
        action: "Show info from Anilibria",
        script: download_page
    }]);
})();
