    function exportJSON() {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(vocabularies, null, 2));
      const anchor = document.createElement('a');
      anchor.setAttribute("href", dataStr);
      anchor.setAttribute("download", "vocabularies.json");
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
    }

    function importJSON(event) {
      const reader = new FileReader();
      reader.onload = function(e) {
        try {
          const data = JSON.parse(e.target.result);
          if (Array.isArray(data)) {
            vocabularies = data;
            saveToLocalStorage();
            populateCategories();
            filterVocab();
            notify('Vocabulary list updated successfully!');
          }
        } catch (err) {
          notify('Invalid JSON file.');
        }
      };
      reader.readAsText(event.target.files[0]);
    }
