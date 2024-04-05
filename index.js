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

    var allActions = {
        "receive": {
            "title" : "Приём",
            "quality" : ["#", "+", "!", "-", "="]
        },
        "serve": {
            "title" : "Подача",
            "quality" : ["ace", "+", "!", "-"]
        },
        "attack": {
            "title" : "Атака",
            "quality" : ["+", "!", "-"]
        },
        "defence": {
            "title" : "Защита",
            "quality" : ["+", "!", "-"]
        },
        "set": {
            "title" : "Пас",
            "quality" : ["П+", "П-", "З+", "З-"]
        },
        "block" : {
            "title" : "Блок",
            "quality" : ["+", "!"]
        }
    };

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

    $.each(allActions, function(id, value){
        $actions.append(
             $("<input>")
                .attr("type", "radio")
                .attr("name", "action")
                .attr("id", id)
                .attr("value", value.title)
                .attr("disabled", true)
        );
        $actions.append($("<label>").attr("for", id).text(value.title));
    });

    $players.on("change", "input", function(){
        $actions.find("input").attr("disabled", false);
        $actions.find(":checked").prop("checked", false);
        $quality.empty();
    });

    $actions.on("change", "input", function(){
        var action = allActions[$actions.find(":checked").attr("id")];
        $quality.empty();
        $.each(action.quality, function(index, value){
            var id =  "quality" + index;
            $quality.append(
                $("<input>")
                    .attr("type", "radio")
                    .attr("name", "quality")
                    .attr("id", id)
                    .attr("value", value)
            );
            $quality.append($("<label>").attr("for", id).text(value));
        });
    });

    $quality.on("change", "input", function(){
        var player = $players.find(":checked").val();
        var action = $actions.find(":checked").attr("id");
        var quality = $quality.find(":checked").val();

        var currentStats = readStats();
        currentStats.push({
            "player" : player,
            "action" : action,
            "quality" : quality
        });
        localStorage.setItem("stats", JSON.stringify(currentStats));

        reloadStats();

        $players.find(":checked").prop("checked", false);
        $actions.find("input").attr("disabled", true);
        $actions.find(":checked").prop("checked", false);
        $quality.empty();
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
            $.each(allActions, function(id, action){
                table[player][id] = [];
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
        $.each(allActions, function(id, action){
            var $row = $("<tr>");
            $row.append($("<td>").text(action.title));
            $.each(allPlayers, function(index, player){
                var units = table[player][id];
                var total = units.length;
                var text = "";
                if(total > 0){
                    $.each(action.quality, function(index, quality){
                        var qualityUnits = $.grep(units, function(unit){
                            return unit === quality;
                        });
                        if(qualityUnits.length > 0){
                            var percentage = (100 * parseFloat(qualityUnits.length) / total).toFixed(0);
                            text += "<div>" + quality + ": " + percentage + "%</div>";
                        }
                    });
                    text += "<div>всего: "+ total +"</div>";
                }
                $row.append($("<td>").html(text));
            });
            $stats.append($row);
        });
    };
});

