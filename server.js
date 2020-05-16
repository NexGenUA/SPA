const http = require('http');
const https = require('https');
const fs = require('fs');
const mime = require('mime');
const routes = new Set(['/', '/list', "/task-M7OtFFF_GsHag0CtgTZ", "/task-M7OtFFP-UxzCrkyyKFd", "/task-M7OtFGmC4DTj72bLpcj", "/task-M7OtFGmC4DTj72bLpck", "/task-M7OtFGnWFtZPp1_HdoF", "/task-M7OtFGvllFfgNv892Y8", "/task-M7OtFH_bK3izZsh8ER8", "/task-M7OtFHhbvPhA84F8Khv", "/task-M7OtFJ39t1zOcn_zpHK", "/task-M7OtFJ5moKTWfO8atjF", "/task-M7OtFJ6l9sX0RQQbuRS", "/task-M7OtFJL6ClwLVp9NCEB", "/task-M7OtFJuWEAMPqN5-2oS", "/task-M7OtFK0HIAwvb8N267I", "/task-M7OtFLNX-CLQ2p8Lr0I", "/task-M7OtFLOCWtqBVPslTC0", "/task-M7OtFLdZww_niYG83dB", "/task-M7OtFM7YkbI2gjc-N0Z", "/task-M7OtFMGR6iqncGJOaor", "/task-M7OtFMKvWfzq0fXjnjF", "/task-M7OtFNe5SCjhXIp1AN3", "/task-M7OtFNf3CaBxkxo8vX3", "/task-M7OtFNxA5xvAtE6cA0a", "/task-M7OtFOOtggJrZXv4tXd", "/task-M7OtFOZm6kwVHTwGrDe", "/task-M7OtFOdHS5cRrbW0a1b", "/task-M7OtFPvl4uUulzG0ifh", "/task-M7OtFQ-pdXm94EJeiHI", "/task-M7OtFQItOcz7fhnlp7q", "/task-M7OtFQjF8n5o1rkLmgT", "/task-M7OtFQx9k1hCDeXM4sj", "/task-M7OtFR-tZQMOAXIe-Zt", "/task-M7OtFSC8ga9kXjmZ5un", "/task-M7OtFSLPI_S6oxudmf-", "/task-M7OtFSetQmKxkRaEEns", "/task-M7OtFT0-bCW6H1fyGkF", "/task-M7OtFTGbFkyQMJJ_Lbf", "/task-M7OtFTMJRukI4fgG6ab", "/task-M7OtFUWzBlRxD_t2X9G", "/task-M7OtFUbyLGoCrg2-gLW", "/task-M7OtFV-GHpkg1_j9Oao", "/task-M7OtFVHTYjJuMZv3yR-", "/task-M7OtFVbJAKXFRx-EeXP", "/task-M7OtFVhWRvZLWdUlD8f", "/task-M7OtFWpOe_hoUjA8ubP", "/task-M7OtFWxaPveqy6ILiWj", "/task-M7OtFXIY952Xxk7rmY-", "/task-M7OtFXcQw416oQojqYI", "/task-M7OtFXyNwepuYn5DnO-", "/task-M7OtFY3hcdgVkD4oMIh", "/task-M7OtFZ9KpPnYG__pn5P", "/task-M7OtFZHUB7uuD1IEaJ3", "/task-M7OtFZcKk5WKSjTjqwh", "/task-M7OtFZu0yQ6pXJzgchN", "/task-M7OtF_MrJEfiAEtUbyL", "/task-M7OtF_PR8zh2W3hK19F", "/task-M7OtFaTYOT7Ldd4AE0P", "/task-M7OtFaarNJXLJH-2PeT", "/task-M7OtFax4jqtnJnHpGii", "/task-M7OtFbB68P16OYH7qU5", "/task-M7OtFbfEw6jNiTANvkf", "/task-M7OtFbhA42VEIKvx143", "/task-M7OtFcly5Jz2AENSZZQ", "/task-M7OtFcyZ8VLOVm_yTUI", "/task-M7OtFdGCxy5JqYevxS2", "/task-M7OtFdZ0j2pJJobeKKo", "/task-M7OtFe3UAlKzdjEfzZ4", "/task-M7OtFe8_RzoIGSQXAQy", "/task-M7OtFf4usuVBh6szDGM", "/task-M7OtFfHejE_OoVsZjr9", "/task-M7OtFfaDwyoMw50gD1P", "/task-M7OtFfr4LYgDZRogYWQ", "/task-M7OtFgN3_eIqpCWkNMw", "/task-M7OtFgTf8ivGAVNo8__", "/task-M7OtFhPMK_YaF77CHpw", "/task-M7OtFhZ1IRGgGD1gLuz", "/task-M7OtFhsudI4NGuBxZ4v", "/task-M7OtFi7ruRUwGo7GFki", "/task-M7OtFiiYExGLWBTLM6r", "/task-M7OtFime9i59UMPegul", "/task-M7OtFjfeltOFIpiOzqb", "/task-M7OtFjrZoqUTQh2UYqm", "/task-M7OtFkHU4n3w2Y6oKex", "/task-M7OtFkTPl012aZ0H2Ll", "/task-M7OtFl538gRmbzZcRKI", "/task-M7OtFl7q8pDyqRkVTVb", "/task-M7OtFm-MSj8vntrdLrr", "/task-M7OtFmBACKLMavM_zvG", "/task-M7OtFmZUT9GJYgl8qAk", "/task-M7OtFmlOOwfS_IdV97N", "/task-M7OtFnR-d4sx93kcQ0r", "/task-M7OtFnTAzQhcnH-HZI8", "/task-M7OtFoGaeVkxXuRB5oU", "/task-M7OtFoUVuhSULwqBTgf", "/task-M7OtFouiimqWyLl9m2E", "/task-M7OtFp6W4_PPeJzwiAn", "/task-M7OtFpm9RM6i9SwiTKx", "/task-M7OtFpp2dmGVqkTrGTj", "/task-M7OtFqYvHCAF2fCXTEd", "/task-M7OtFqnZD_G98H1m9-O", "/task-M7OtWFORgrJ6cCVsL6e", "/task-M7OtWFXW2RkBHDQ3877", "/task-M7OtWFaKUknlciN6klo", "/task-M7OtWFtXWJlkzjNei14", "/task-M7OtWHGufrehi-LHNiK", "/task-M7OtWHb5R5C_i8g-ndK", "/task-M7OtWHjaqDGdxFiAot9", "/task-M7OtWHrysNgYMOhdBP9", "/task-M7OtWHwI6gGeXkCVrZr", "/task-M7OtWII7w4LXBT08EVz", "/task-M7OtWJXA0dwVxlNOEy7", "/task-M7OtWJzSd2zZgPCC7GQ", "/task-M7OtWK5OPyywJKMV1vD", "/task-M7OtWKAWwHJ_Y8oNnyt", "/task-M7OtWKIguRQUPaiFLAo", "/task-M7OtWKhqbUAglG_esrc", "/task-M7OtWLs_DKFJIhL502B", "/task-M7OtWMOhKGUCF3Hx-Zf", "/task-M7OtWMTod22YLxbzn4h", "/task-M7OtWMcjrxqZndfWHof", "/task-M7OtWN2j25PoDFYpCyv", "/task-M7OtWNUrvNwT7iOBGXs", "/task-M7OtWO9Z8Ul2IewQbeg", "/task-M7OtWOj5YMluclb9BY0", "/task-M7OtWOqdQ-ATPGGdm6U", "/task-M7OtWOy7c4t0a6iQnAm", "/task-M7OtWPRWn1TCZV3UInW", "/task-M7OtWPpP2UT9qDVNM14", "/task-M7OtWQTlBVaCFrfSVsr", "/task-M7OtWR9c-C6orliHDUN", "/task-M7OtWRHz8Tb2X2_XZ5N", "/task-M7OtWRk0ZuDud-Tc2wZ", "/task-M7OtWRq3XLiP34LjsRE", "/task-M7OtWSFvHGFn5ym08d-", "/task-M7OtWSl9tmypkVboLhy", "/task-M7OtWTTpOonrmXwQIJX", "/task-M7OtWTdLW40SQn_fo6z", "/task-M7OtWU4Ox1VF7wybHHv", "/task-M7OtWUBZylNluEAbZIr", "/task-M7OtWU_dqWHk-tDHlDW", "/task-M7OtWV4mkZAPlFbaHHk", "/task-M7OtWVox1Rr9ls6dXOu", "/task-M7OtWVyW3NKuGc834-9", "/task-M7OtWWP8Rs9U2vfhRL9", "/task-M7OtWW_m0S8MLwMfNZX", "/task-M7OtWWwOEv0ph4q2xmb", "/task-M7OtWXMYMLhDy-qcqf3", "/task-M7OtWY8iuo0p7KgOGXN", "/task-M7OtWYIkfZ47swE16Xp", "/task-M7OtWYpAPE3B7kqHs9b", "/task-M7OtWYyBG9udQWuO-bC", "/task-M7OtWZHVJu8V6uarOWv", "/task-M7OtWZfOOKnNjKLOYE6", "/task-M7OtW_UodIqPgaHT2NG", "/task-M7OtW_bJUmANyYjMWwu", "/task-M7OtWa9Y6sG94WxKvb2", "/task-M7OtWaLYkDGn_hPEDcy", "/task-M7OtWadNIb4RvXhbsUg", "/task-M7OtWaxRxHqUP2PmMQw", "/task-M7OtWc-Luym9pjpdKR7", "/task-M7OtWc1K4gtLB33G4w1", "/task-M7OtWcVaf9TE8UKmJca", "/task-M7OtWciOJOa9z6Tlzkf", "/task-M7OtWcwDU8hobC2MrEQ", "/task-M7OtWdVqXcK6EG0RdJ9", "/task-M7OtWeNOQqhbN7R4urL", "/task-M7OtWeQaX4zbRlPQjrc", "/task-M7OtWepxm9r7I0ncQIw", "/task-M7OtWf74Xa5AMYvYAFM", "/task-M7OtWfJoNH8MDBoi797", "/task-M7OtWfm32M4iyAkDIHN", "/task-M7OtWggmvlxJMmEA4tg", "/task-M7OtWgjzkxKDEpwkY2I", "/task-M7OtWh96Lk4rMfjEa-y", "/task-M7OtWhWd7m2lZ9fOPfT", "/task-M7OtWhdW-rNaIGeEPam", "/task-M7OtWi4sR5qkCgD7lvs", "/task-M7OtWj-KSfud9ng3U4k", "/task-M7OtWj20Mb9rthdqeSM", "/task-M7OtWjYsgHA5hSddpPb", "/task-M7OtWju0yN264xwKtzp", "/task-M7OtWjyxy0rAvA5CTI5", "/task-M7OtWkO38H0TMhXnuZF", "/task-M7OtWlK4opChx4AgYIe", "/task-M7OtWlMQUgqs3q4Xeue", "/task-M7OtWlrpdnejiWtVasp", "/task-M7OtWmHBEviK-myDQP1", "/task-M7OtWmHBEviK-myDQP2", "/task-M7OtWmfuvwQM7yJOACI", "/task-M7OtWndnLLHOpPwnFSW", "/task-M7OtWniOIQZ2F3OHM8m", "/task-M7OtWoD972B4oFgO6EA", "/task-M7OtWo_ICk7tjK-TI8I", "/task-M7OtWomDvEoM1szy3Yu", "/task-M7OtWozeh2FIEnMzF9x", "/task-M7OtWpxG-ReDnciAL8a", "/task-M7OtWq2MDZ7Of6GCOaH", "/task-M7OtWqY6sj9Be7WoFGY", "/task-M7OtWqvovGqjWwiwZKP", "/task-M7OtWr8T3ZFtAA5hRxF", "/task-M7OtkfXAJ9bfV1hIYGL", "/task-M7OtkgdCZMQMAceMT1Q", "/task-M7OtkhJE8qoXWNZYD2q", "/task-M7OtkhaQSGV-nBZ4pxv", "/task-M7OtkhaQSGV-nBZ4pxw", "/task-M7OtkhbqUEoYubbMLM4", "/task-M7Otkhqpxdr8GQ_Lo0y", "/task-M7Otkj0d3VCSjhf_zdH", "/task-M7Otkja3WAvXvjeXNTF", "/task-M7OtkjvtkMuv8g2QFYP", "/task-M7OtkjvtkMuv8g2QFYQ", "/task-M7Otkk-0PbCG9z57ENG", "/task-M7Otkk9EvEqRUKP_V--", "/task-M7OtklMT4Yb6SEdrQNx", "/task-M7OtkmEuqoNz3uvwGAu", "/task-M7OtkmEuqoNz3uvwGAv", "/task-M7OtkmIA-7nFymDWMaD", "/task-M7OtkmU8nCxt43XXWrL", "/task-M7OtkmpBba6T0f2jBN7", "/task-M7OtknjyOmkWWBd6psN", "/task-M7OtkoYxeubtrgq7oJW", "/task-M7Otko_CSKWkXA5y0YA", "/task-M7OtkodckkgIbJaiE56", "/task-M7Otkoncxw_rVdHjIzw", "/task-M7Otkp6h_tFDJw830vC", "/task-M7Otkq4YEAms3DETbyk", "/task-M7OtkqtyptqyYpoL-Pe", "/task-M7OtkqwZ-FfvvXPdVp7", "/task-M7OtkqwZ-FfvvXPdVp8", "/task-M7Otkr9MZ7QL6d9iipg", "/task-M7OtkrP3-NHXPzVSIiJ", "/task-M7OtksT2YZbyHx4O4gH", "/task-M7OtktDtB50IBZ_WaMf", "/task-M7OtktHyLZAaAosH5WM", "/task-M7OtktJXOAz3BYA3zn0", "/task-M7OtktUuTX-d4JgJj7n", "/task-M7OtktkEgxM1u7NAPEL", "/task-M7OtkuqiyFJA1rjTfzl", "/task-M7OtkvcgLeUYtdu970L", "/task-M7OtkvcgLeUYtdu970M", "/task-M7OtkvcgLeUYtdu970N", "/task-M7Otkvq9PsTJi7JQ3oR", "/task-M7Otkw0ctwqo5K-p2_l", "/task-M7OtkxE56SxY3r_pxXc", "/task-M7Otkxzwwlr9uFJsKSr", "/task-M7Otkxzwwlr9uFJsKSs", "/task-M7Otky-N8ywtDRePp2j", "/task-M7OtkyBAD2cnwxWB7yQ", "/task-M7OtkyLOtIpbrXySB43", "/task-M7Otkzmz9tVqaCGUrGN", "/task-M7Otl-LX6FMkHoiwrZi", "/task-M7Otl-MJj5aEmBMsop6", "/task-M7Otl-QACaICNb-3WAO", "/task-M7Otl-YXeWiWvg_cGPK", "/task-M7Otl-bsfgLuvuSlKE8", "/task-M7Otl18PX-odHTRgbL1", "/task-M7Otl1gcBLHSsULmqfI", "/task-M7Otl1iWJ0LNX5jKZet", "/task-M7Otl1mTF_I1uxlUbYA", "/task-M7Otl1rPTjcbziWy9hj", "/task-M7Otl1wy5T0ki7SUp6q", "/task-M7Otl3XyWKJBy_R3L7B", "/task-M7Otl3zPv-m0X6diZXY", "/task-M7Otl41YQKhlYnnuJhB", "/task-M7Otl48lTeWkvEkztwc", "/task-M7Otl4EYCBAXEAWVNDK", "/task-M7Otl4FXukxEdR8sGuA", "/task-M7Otl5uLnE3fm0o6IrW", "/task-M7Otl6L6TtXWoSSQv4W", "/task-M7Otl6OSLLh1meeNtK-", "/task-M7Otl6T3IVBebRsTlqd", "/task-M7Otl6W6FnfvoDNuFjz", "/task-M7Otl6cut4KzSBx-HOp", "/task-M7Otl8G-ZixWM06fhEY", "/task-M7Otl8gQER-8e2hRAPq", "/task-M7Otl8mg1EK6AyrClrz", "/task-M7Otl8wULqRjBq3p0rO", "/task-M7Otl8yHI9n8El9xvT-", "/task-M7Otl93GQf1cypdFhEA", "/task-M7OtlAej_pWwHNujy3Q", "/task-M7OtlB1ABANhHQ4OzBU", "/task-M7OtlB4-cJ76-l5gicz", "/task-M7OtlBKuNau3Sia9W9z", "/task-M7OtlBOPRdlAgL0slfg", "/task-M7OtlD1SZ12C19CyfJW", "/task-M7OtlDM4oIDoigvXVZ_", "/task-M7OtlDPRlV_-O2DhpFA", "/task-M7OtlDfBf-ueYGcnYX_", "/task-M7OtlDlHI_TKoigQ0Tv", "/task-M7OtlFOn0y0biJ4sV1n", "/task-M7OtlFTvU0f1vNWXdxv", "/task-M7OtlFg8A3GBVykRMA0", "/task-M7OtlFkzcuInCUKX6sP", "/task-M7OtlFz7SoMkh6Sdi0y", "/task-M7OtlG7M5-Ti_qs_Heb", "/task-M7OtlHmzDrwSD2eoNfG", "/task-M7OtlHol0Gk-UTQrDi2", "/task-M7OtlI5EnpAyZiY_YB2", "/task-M7OtlI9YwGCc1J-rdXd", "/task-M7OtlIILxXMF2YnNJbb"]);
const PORT = process.env.PORT || 5000;

const getQuery = (str) => {
  const queryParams = str.split('&');

  const filter = new Set(['all', 'active', 'outdated', 'completed']);

  if (queryParams.length !== 2) {
    return null;
  }

  const filterValue = queryParams[0].split('=');
  const pageCount = queryParams[1].split('=');

  if (filterValue.length !== 2 || pageCount.length !== 2) {
    return null;
  }

  if (filterValue[0] !== 'filter' || !filter.has(filterValue[1])) {
    return null
  }

  if (pageCount[0] !== 'page' || !Number.isInteger(+pageCount[1])) {
    return null
  }

  return {
    filter: filterValue[1],
    page: +pageCount[1]
  }
};

const getPagesLength = (value, tasks) => {
  const filters = new Set(['active', 'outdated', 'completed']);

  if (!tasks) {
    return null;
  }

  let filteredTasks = Array.from(Object.entries(tasks)).filter(task => {
      return !!(typeof +new Date(task[1].date) === 'number'
        && typeof task[1].title === 'string'
        && Array.isArray(task[1].chips)
        && task[1].chips.every(c => typeof c === 'string' && c.length < 50)
        && typeof task[1].desc === 'string' && task[1].desc.length < 2049);
    });

    if (filters.has(value)) {
      let entriesTasks = filteredTasks;
      switch (value) {
        case 'active': {
          entriesTasks = entriesTasks.filter(el => {
            return new Date(el[1].date) > Date.now() &&
              !el[1].completed;
          });
          break;
        }
        case 'completed': {
          entriesTasks = entriesTasks.filter(el => el[1].completed);
          break;
        }
        default: {
          entriesTasks =  entriesTasks.filter(el => {
            return new Date(el[1].date) < Date.now() &&
              !el[1].completed;
          });
        }
      }
      filteredTasks = entriesTasks;
    }

    return Math.ceil(filteredTasks.length / 10);
};

const server = http.createServer(async (req, res) => {
  const query = req.url.split('?');

  if (query.length === 2 && query[0] === '/list' && getQuery(query[1])) {
    const filters = getQuery(query[1]);
    const pagesLength = await  new  Promise((resolve, reject) => {
      https.get('https://spa-project-app.firebaseio.com/tasks.json', res => {
        if (res.statusCode !== 200) {
          reject();
        }
        let result = [];
        res.on('data', data => {
          result.push(data);
        });
        res.on('end', () => {
          try {
            result = JSON.parse(Buffer.concat(result).toString());
          } catch(e) {
            console.log(e);
            return;
          }
          const pages = getPagesLength(filters.filter, result);
          resolve(pages);
        });
      }).on('error', (e) => {
        console.error(e);
        return;
      });
    });

    if (filters.page > 0 && filters.page <= pagesLength) {
      res.setHeader('Content-Type', 'text/html');
      fs.ReadStream(__dirname + '/public/index.html').pipe(res);
      return;
    }
  }


  if (req.method === 'POST' && req.url === '/addtask') {
    req.on('data', data => {
      const newId = data.toString().slice(1, -1);
      const id = '/task' + newId;
      routes.add(id);
      res.end('ok');
    });
  } else if (routes.has(req.url)) {
    res.setHeader('Content-Type', 'text/html');
    fs.ReadStream(__dirname + '/public/index.html').pipe(res);
  } else {
    fs.readFile('./public/' + req.url, err => {
      if (!err) {
        const mimeType = mime.getType(req.url) || 'text/plain';
        res.setHeader('Content-type', mimeType);
        fs.ReadStream(__dirname + '/public/' + req.url).pipe(res);
      } else {
        res.writeHead(404, 'Not Found');
        fs.ReadStream(__dirname + '/public/index.html').pipe(res);
      }
    });
  }
});

server.listen(PORT, console.log(`Server is starting, follow : http://127.0.0.1:${PORT}`));
