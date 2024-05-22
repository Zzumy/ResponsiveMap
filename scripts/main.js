$(document).ready(function () {
    let slideIndex = {};
    $(".slider").each(function () {
        let sliderId = $(this).attr("id");
        slideIndex[sliderId] = 1;
        showSlides(sliderId, slideIndex[sliderId]);
    });
    function plusSlides(sliderId, n) {
        showSlides(sliderId, (slideIndex[sliderId] += n));
    }
    function currentSlide(sliderId, n) {
        showSlides(sliderId, (slideIndex[sliderId] = n));
    }
    function showSlides(sliderId, n) {
        let i;
        let slides = $(`#${sliderId} .mySlides`);
        let dots = $(`#${sliderId} .dot`);
        if (n > slides.length) {
            slideIndex[sliderId] = 1;
        }
        if (n < 1) {
            slideIndex[sliderId] = slides.length;
        }
        for (i = 0; i < slides.length; i++) {
            $(slides[i]).css("display", "none");
        }
        for (i = 0; i < dots.length; i++) {
            $(dots[i]).removeClass("active");
        }
        $(slides[slideIndex[sliderId] - 1]).css("display", "block");
        $(dots[slideIndex[sliderId] - 1]).addClass("active");
    }
    $(".prev").on("click", function () {
        let sliderId = $(this).closest(".slider").attr("id");
        plusSlides(sliderId, -1);
    });
    $(".next").on("click", function () {
        let sliderId = $(this).closest(".slider").attr("id");
        plusSlides(sliderId, 1);
    });
    $(".dot").on("click", function () {
        let sliderId = $(this).closest(".slider").attr("id");
        currentSlide(sliderId, $(this).index() + 1);
    });
    let x = 0;
    let y = 148;
    let zoom = 1;
    let img = $("#map");
    let isDragging = false;
    function togglePanel() {
        let panel = $("#panel");
        let toggleButton = $("#togglePanelButton");
        let toggleButtonIcon = $("#panelToggleButtonIcon");

        if (panel.css("transform") === "matrix(1, 0, 0, 1, 0, 0)") {
            panel.css("transform", "translateY(-555px)");
            panel.css("top", "90");
            toggleButtonIcon.attr("class", "bi bi-chevron-down");
        } else {
            panel.css("transform", "translateY(0)");
            panel.css("top", null);
            toggleButton.css("transform", "translateY(0)");
            toggleButtonIcon.attr("class", "bi bi-chevron-up");
        }
    }
    img.on("mousedown", function (event) {
        isDragging = true;
        let offset = img.offset();
        x =
            event.clientX -
            offset.left +
            (img.width() - img.width() * zoom) / 2;
        y =
            event.clientY -
            offset.top +
            (img.height() - img.height() * zoom) / 2;
    });
    $(document).on("mouseup", function (event) {
        if (isDragging) {
            isDragging = false;
        }
    });
    $(document).on("mousemove", function (event) {
        if (isDragging) {
            let newX = event.clientX - x;
            let newY = event.clientY - y;
            let parentWidth = img.parent().width();
            let parentHeight = img.parent().height();
            let imgWidth = img.width();
            let imgHeight = img.height();
            if (newX > 0 - (img.width() - img.width() * zoom) / 2) {
                newX = 0 - (img.width() - img.width() * zoom) / 2;
            } else if (
                newX <
                parentWidth - imgWidth + (img.width() - img.width() * zoom) / 2
            ) {
                newX =
                    parentWidth -
                    imgWidth +
                    (img.width() - img.width() * zoom) / 2;
            }
            if (newY > 148 - (img.height() - img.height() * zoom) / 2) {
                newY = 148 - (img.height() - img.height() * zoom) / 2;
            } else if (
                newY <
                parentHeight -
                    imgHeight +
                    innerHeight +
                    (img.height() - img.height() * zoom) / 2
            ) {
                newY =
                    parentHeight -
                    imgHeight +
                    innerHeight +
                    (img.height() - img.height() * zoom) / 2;
            }
            img.css({left: newX + "px", top: newY + "px"});
        }
        if (event.clientY > window.innerHeight - 50) {
            event.preventDefault();
        }
    });
    img.on("wheel", function (e) {
        e.preventDefault();
        if (e.originalEvent.deltaY < 0) {
            zoom += 0.1;
        } else {
            zoom -= 0.1;
        }
        zoom = Math.min(Math.max(1, zoom), 3);
        let newX = e.clientX - x;
        let newY = e.clientY - y;
        let parentWidth = img.parent().width();
        let parentHeight = img.parent().height();
        let imgWidth = img.width();
        let imgHeight = img.height();
        if (newX > 0 - (img.width() - img.width() * zoom) / 2) {
            newX = 0 - (img.width() - img.width() * zoom) / 2;
        } else if (
            newX <
            parentWidth - imgWidth + (img.width() - img.width() * zoom) / 2
        ) {
            newX =
                parentWidth - imgWidth + (img.width() - img.width() * zoom) / 2;
        }
        if (newY > 148 - (img.height() - img.height() * zoom) / 2) {
            newY = 148 - (img.height() - img.height() * zoom) / 2;
        } else if (
            newY <
            parentHeight -
                imgHeight +
                innerHeight +
                (img.height() - img.height() * zoom) / 2
        ) {
            newY =
                parentHeight -
                imgHeight +
                innerHeight +
                (img.height() - img.height() * zoom) / 2;
        }
        img.css({left: newX + "px", top: newY + "px"});
        img.css("transform", `scale(${zoom})`);
    });
    $("#hamburger").on("click", function () {
        let x = $("#myTopnav");
        let y = $("#panel");
        x.toggleClass("responsive");
        y.toggleClass("responsive");
    });
    $("#togglePanelButton").on("click", function () {
        togglePanel();
    });
    $("#cent button").on("click", function () {
        $("#summary > div").hide();
        $("#expCent").show();
    });
    $("#wats button").on("click", function () {
        $("#summary > div").hide();
        $("#expWats").show();
    });
    $("#hey button").on("click", function () {
        $("#summary > div").hide();
        $("#expHey").show();
    });
    $("#west button").on("click", function () {
        $("#summary > div").hide();
        $("#expWest").show();
    });
    $("#santo button").on("click", function () {
        $("#summary > div").hide();
        $("#expSanto").show();
    });
    $("#pacific button").on("click", function () {
        $("#summary > div").hide();
        $("#expPacific").show();
    });
    $("#out button").on("click", function () {
        $("#summary > div").hide();
        $("#expOut").show();
    });
    $("#dog button").on("click", function () {
        $("#summary > div").hide();
        $("#expDog").show();
    });
    togglePanel();
});
