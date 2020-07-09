import React, { useState } from 'react';

function upload(setMusic) {
    const form = new FormData();
    const fileObj = document.getElementById("musicFile").files[0];
    form.append("file",fileObj);
    fetch("music", {
        method: 'POST',
        body: form,
    })
        .then(function(response) {
            return response.json();
        })
        .then((e)=>{
            setMusic(e)
        });
}

function Music() {
    const [music, setMusic] = useState();

    return (
        <div style={{ padding: 50 }}>
            <div>
                <input id="musicFile" type="file" accept="audio/*" onChange={() => upload(setMusic)} style={{ width: "100%" }} />
            </div>
            {music && <div>
                <p>{`歌曲名称：${music.title || "未知"}`}</p>
                <p>{`专辑：${music.album || "未知"}`}</p>
                <p>{`艺人：${music.artist || "未知"}`}</p>
                <p>{`作曲：${music.composer || "未知"}`}</p>
                <p>{`作词：${music.lyricist || "未知"}`}</p>
                <p>封面：{music.covers && music.covers.length > 0 ?
                    music.covers.map(cover => <img src={`data:image/png;base64,${cover}`} alt={"封面"}/>) : "无"}</p>
            </div>}
        </div>
    );
}

export default Music;
