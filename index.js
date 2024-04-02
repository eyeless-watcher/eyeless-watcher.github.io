$(function(){
    var allPlayers = [
        "Паша",
        "Кирилл",
        "Женя",
        "Лёха",
        "Лиза",
        "Рус",
        "Дима",
        "Катя",
        "Аня",
        "Саня",
    ];

    var allActions = [
        "Подача",
        "Приём",
        "Пас",
        "Атака",
        "Блок",
        "Защита",
    ];

    var allQuality = [
        "Очко проиграно",
        "Пришлось спасать",
        "С пивом потянет",
        "Идеально",
    ];

    var $players = $("#players");
    var $actions = $("#actions");
    var $quality = $("#quality");

    $.each(allPlayers, function(index, value){
        $players.append(
            $("<input>")
                .attr("type", "radio")
                .attr("name", "player")
                .attr("id", value)
                .attr("value", value)
        );
        $players.append($("<label>").attr("for", value).text(value));
    });

    $.each(allActions, function(index, value){
        $actions.append(
             $("<input>")
                .attr("type", "radio")
                .attr("name", "action")
                .attr("id", value)
                .attr("value", value)
                .attr("disabled", true)
        );
        $actions.append($("<label>").attr("for", value).text(value));
    });

    $.each(allQuality, function(index, value){
        var id =  "quality" + index;
        $quality.append(
            $("<input>")
                .attr("type", "radio")
                .attr("name", "quality")
                .attr("id", id)
                .attr("value", index)
                .attr("disabled", true)
        );
        $quality.append($("<label>").attr("for", id).text(value + " (" + index + ")"));
    });

    var $playersInput = $players.find("input");
    var $actionsInput = $actions.find("input");
    var $qualityInput = $quality.find("input");

    $playersInput.change(function() {
        $actionsInput.prop("checked", false).attr("disabled", false);
        $qualityInput.prop("checked", false).attr("disabled", true);
    });

    $actionsInput.change(function(){
        $qualityInput.prop("checked", false).attr("disabled", false);
    });

    $qualityInput.change(function(){
        var player = $playersInput.filter(":checked").val();
        var action = $actionsInput.filter(":checked").val();
        var quality = $qualityInput.filter(":checked").val();

        var currentStats = readStats();
        currentStats.push({
            "player" : player,
            "action" : action,
            "quality" : parseInt(quality, 10)
        });
        localStorage.setItem("stats", JSON.stringify(currentStats));

        reloadStats();

        $playersInput.prop("checked", false);
        $actionsInput.prop("checked", false).attr("disabled", true);
        $qualityInput.prop("checked", false).attr("disabled", true);
    });

    $("#clear").click(function(){
        localStorage.setItem("stats", "[]");
        reloadStats();
    });

    var $stats = $("#stats");

    reloadStats();

    function readStats(){
        return JSON.parse(localStorage.getItem("stats") || "[]");
    }

    function reloadStats(){
        var table = {};
        $.each(allPlayers, function(index, player){
            table[player] = {};
            $.each(allActions, function(index, action){
                table[player][action] = [];
            });
        });
        var stats = readStats();
        $.each(stats, function(index, value){
            table[value.player][value.action].push(value.quality);
        });

        $stats.empty();
        var $firstRow = $("<tr>").append("<td>");
        $.each(allPlayers, function(index, player){
            $firstRow.append($("<td>").text(player));
        });
        $stats.append($firstRow);
        $.each(allActions, function(index, action){
            var $row = $("<tr>");
            $row.append($("<td>").text(action));
            $.each(allPlayers, function(index, player){
                var units = table[player][action];
                var sum = 0;
                var total = units.length;
                for(var i = 0; i < total; i++ ){
                    sum += units[i];
                }
                var avg = sum/total;
                var text = total == 0 ? "" : avg.toFixed(2) + " ("+ total +")";
                $row.append($("<td>").text(text));
            });
            $stats.append($row);
        });
    };
});

