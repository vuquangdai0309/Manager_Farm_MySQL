document.addEventListener('DOMContentLoaded', function () {
    const TreesSelect = $('#tree_id');
    const SeasonsSelect = $('#season_id');

 //   fetchTree(TreesSelect.val())
    TreesSelect.on('change', () => {
        const TreeId = TreesSelect.val();
            fetchTree(TreeId) 
    });
    function fetchTree(tree, callback) {
        fetch(`/season/${tree}/getSeasonWithTree`)
            .then(response => response.json())
            .then(datas => {
                SeasonsSelect.empty();
                datas.forEach(data => {
                    const option = $('<option>');
                    option.val(data._id);
                    option.text(data.nameSeason);
                    SeasonsSelect.append(option);
                });

            })
    }
})
