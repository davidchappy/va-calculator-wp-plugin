// Assumes VA_RATES is defined; this is a work-around from not knowing how to import JSON locally

var MOBILE_BREAKPOINT = 950

jQuery(document).ready(function ($) {
  // STATE
  var disabilities = [];
  var childrenUnder18 = 0;
  var children18to24 = 0;
  var maritalStatus = 0;
  var dependentParents = 0;
  var spouseRequiresAid = 0;
  var selectedLimb = "";
  var limbHover = "";
  let isMobile = window.innerWidth < MOBILE_BREAKPOINT
  var resizeThrottled

  // FUNCTIONS

  // Calculate data and update both current and combined percent circles
  function updatePercent() {
    var percent = calculatePercent(disabilities.map(d => d.percent));
    var bilaterals = calculateBilateralRates(disabilities);
    var barTotal = percent + bilaterals;
    if (barTotal > 100) {
      barTotal = 100;
    }
    var barTotalRound = Math.round(barTotal)
    // var roundedFinalTotal = Math.round(barTotal);
    var roundedFinalTotal = Math.round(barTotal / 10) * 10
    toggleEmployability(roundedFinalTotal);
    if (barTotalRound >= 95) {
      roundedFinalTotal = 100;
    }  

    //var roundedFinalTotal = Math.ceil((barTotal + 1) / 10) * 10;
    $("#disabilityvalue").text(
      barTotalRound.length === 0 ? "0%" : barTotalRound.toString() + "%"
    );
    $("#totaldisability").circleProgress({
      value: barTotalRound.length === 0 ? 0 : barTotalRound / 100,
      animationStartValue: 0
    });
    $("#roundeddisability").circleProgress({
      value: roundedFinalTotal / 100,
      animationStartValue: 0
    });
    $("#roundeddisabilityvalue").text(
      roundedFinalTotal.length === 0 ? "0%" : roundedFinalTotal.toString() + "%"
    );
  }

  // Remove visual limb selection
  function deselectLimb() {
    // $(".vac-limb").removeClass("selectedLimbHover")
    $(".vac-limb").removeClass("selectedlimb");
    $(".vac-limb").removeClass("arrow");
    selectedLimb = "";
    //returnLayout();
  }

  function deselectPercent() {
    $(".vac-percent").attr("checked", false);
  }

  // Pure recursive function that calculates benefits for a list of percentages
  function calculatePercent(rates, i = 0) {
    if (!rates.length) return 0;
    var rate = parseInt(rates[i]);
    if (i === rates.length - 1) {
      return rate;
    } else {
      var returned =
        rate +
        Math.round(calculatePercent(rates, i + 1) * ((100 - rate) / 100));
      return returned;
    }
  }

  // Pure function that prepares data for bilateral limb calculation
  function pairLimbs(limbType, disabilities) {
    var bilaterals = [];
   var right = disabilities.find(d => d.limb === `right${limbType}`);
    var left = disabilities.find(d => d.limb === `left${limbType}`);
    if (right && left) {
      var limbArray = [right.percent, left.percent];
      limbArray.sort((a, b) => b - a);
      bilaterals.push(limbArray);
    }

    return bilaterals;
  }

  // Pure function that calculates bilateral rates for a list of disabilities;
  //   returns 0 if none
  function calculateBilateralRates(disabilities) {
    var bilaterals = [
      ...pairLimbs("arm", disabilities),
      ...pairLimbs("leg", disabilities)
    ];

    var bilateralTotal = 0;

    bilaterals.forEach(limbArray => {
      if (!limbArray.length || !limbArray[0] || !limbArray[1]) return;
      var bigger = parseInt(limbArray[0]);
      var smaller = parseInt(limbArray[1]);
      bilateralTotal = calculatePercent([bigger, smaller], 0) * 0.1;
    });
      if (bilateralTotal > 0) {
      $(".vac-bilateral-factor").removeClass("hidden")
      $("#bilateral-factor-value").text(bilateralTotal.toFixed(1))
    }
    if (bilateralTotal <= 0) {
      $(".vac-bilateral-factor").addClass("hidden")
      $("#bilateral-factor-value").text("")
    }
    return bilateralTotal;
  }

  function toggleEmployability(currentPercent) {
    if (currentPercent >= 60) {
      $(".vac-employability-message").removeClass("hidden");
    } else {
      $(".vac-employability-message").addClass("hidden");
    }
  }

  // Obtain current state data and calculate monthly income
  function calculatePayment() {
    if (parseInt($("#roundeddisability").text()) === 0) {
      $("#spnmoneytotal .vac-moneytotal__dollars").text("0");
    } else {
      var ratetype = "veteran";
      var finalTotal = 0;
      var roundedPercentage = parseInt($("#roundeddisability").text());
      // var data = $.getJSON("js/varates2020.json");
      // In WordPress, no simple way to host and retrieve the latest rates as JSON

      // data.done(function (json) {
      json = VA_RATES;
      if (roundedPercentage < 30) {
        ratetype = "veteran";
      } else {
        if (
          children18to24 === 0 &&
          childrenUnder18 === 0 &&
          maritalStatus === 0 &&
          dependentParents === 0
        ) {
          ratetype = "veteran";
        }
        if (
          children18to24 === 0 &&
          childrenUnder18 === 0 &&
          maritalStatus === 1 &&
          dependentParents === 0
        ) {
          ratetype = "withspouseonly";
        }
        if (
          children18to24 === 0 &&
          childrenUnder18 === 0 &&
          maritalStatus === 1 &&
          dependentParents === 1
        ) {
          ratetype = "withspouseandoneparent";
        }
        if (
          children18to24 === 0 &&
          childrenUnder18 === 0 &&
          maritalStatus === 1 &&
          dependentParents === 2
        ) {
          ratetype = "withspouseandtwoparents";
        }
        if (
          children18to24 === 0 &&
          childrenUnder18 === 0 &&
          maritalStatus === 0 &&
          dependentParents === 1
        ) {
          ratetype = "withoneparent";
        }
        if (
          children18to24 === 0 &&
          childrenUnder18 === 0 &&
          maritalStatus === 0 &&
          dependentParents === 2
        ) {
          ratetype = "withtwoparents";
        }
        if (
          (children18to24 > 0 ||
            childrenUnder18 > 0) &&
          maritalStatus === 1 &&
          dependentParents === 0
        ) {
          ratetype = "withspouseandchild";
        }
        if (
          (children18to24 > 0 ||
            childrenUnder18 > 0) &&
          maritalStatus === 0 &&
          dependentParents === 0
        ) {
          ratetype = "withchildonly";
        }
        if (
          (children18to24 > 0 ||
            childrenUnder18 > 0) &&
          maritalStatus === 1 &&
          dependentParents === 1
        ) {
          ratetype = "withspouseoneparentandchild";
        }
        if (
          (children18to24 > 0 ||
            childrenUnder18 > 0) &&
          maritalStatus === 1 &&
          dependentParents === 2
        ) {
          ratetype = "withspousetwoparentsandchild";
        }
        if (
          (children18to24 > 0 ||
            childrenUnder18 > 0) &&
          maritalStatus === 0 &&
          dependentParents === 1
        ) {
          ratetype = "withoneparentandchild";
        }
        if (
          (children18to24 > 0 ||
            childrenUnder18 > 0) &&
          maritalStatus === 0 &&
          dependentParents === 2
        ) {
          ratetype = "withtwoparentsandchild";
        }
        if (maritalStatus === 1 && spouseRequiresAid === 1) {
          finalTotal += parseFloat(json["aaspouse"][roundedPercentage]);
        }
        var totalchildren = children18to24 + childrenUnder18;
        if (totalchildren > 1) {
          if (children18to24 === 1 && childrenUnder18 === 1) {
            finalTotal += parseFloat(
              json["additionalchildover18"][roundedPercentage]
            );
          } else {
            if (childrenUnder18 > 0) {
              for (i = 1; i < childrenUnder18; i++) {
                finalTotal += parseFloat(
                  json["additionalchild"][roundedPercentage]
                );
              }
              for (i = 0; i < children18to24; i++) {
                finalTotal += parseFloat(
                  json["additionalchildover18"][roundedPercentage]
                );
              }
            } else {
              for (i = 1; i < children18to24; i++) {
                finalTotal += parseFloat(
                  json["additionalchildover18"][roundedPercentage]
                );
              }
            }
          }
        }
      }
      finalTotal += parseFloat(json[ratetype][roundedPercentage]);
      $("#spnmoneytotal .vac-moneytotal__dollars").text(
        finalTotal.toFixed(2)
      );
      // });
    }
  }

  // Add percentage items (ex: limbs) to list, including local state
  function addItemToList(limb, limbLabel, percent, id) {
    // var isArm = limb.includes("Arm");
    // var isLeg = limb.includes("Leg");
    disabilities.push({ limb, percent, id });

    return (
      '<li role="presentation" class="list-group-item">' +
      '<button data-id="' +
      id +
      '" data-limb="' +
      limb +
      '" class="vac-remove-item" aria-label="Close">' +
      (!!limbLabel ? limbLabel + "<br/>" : "") +
      percent +
      "%</button></li>"
    );
  }

  function updateLayout() {
    if (window.innerWidth >= MOBILE_BREAKPOINT) {
      var extraBottomHalfPadding = parseInt($("#ulDisabilities").css("height"));
      var formHeightPadding = parseInt($(".vac-bottom-half").css("padding-top"));
      extraBottomHalfPadding += parseInt($(".vac-spouserequire").css("height")) - 20;
      $(".vac-bottom-half").css("padding-top", 450 + extraBottomHalfPadding)
      //$(".vac-bottom-half").css("padding-top", 20px + formHeightPadding + extraBottomHalfPadding)
    }

    if ($("#ulDisabilities").children().length) {
      $(".vac-click-to-remove").show();
    } else {
      $(".vac-click-to-remove").hide();
    }
  }

  function checkMobileOnResize(event) {
    if (!resizeThrottled) {
      isMobile = window.innerWidth < MOBILE_BREAKPOINT
      resizeThrottled = true;
      setTimeout(function() {
        resizeThrottled = false;
      }, 250);
    }  
  }

  // function returnLayout() {
  //   var formHeightPaddingReturn = parseInt($(".vac-bottom-half").css("padding-top"));
  //   $(".vac-bottom-half").css("padding-top", 20px + formHeightPaddingReturn);
  // }

  // LISTENERS
  // Listen for clicks on limbs (left arm etc) and applies styles
  $(".vac-limb").click(function (e) {
    e.preventDefault();
    deselectLimb();
    var id = $(this).attr("id");
    if (disabilities.map(d => d.limb).includes(id)) {
      // Don't add the same limb more than once
      return
    }
    $(this).addClass("selectedlimb");
    $(this).addClass("arrow");
    limbHover = $(this);
    selectedLimb = id;
  });

  $("#totaldisability").circleProgress({
    value: 0.0,
    size: 150,
    thickness: 30,
    fill: {
      gradient: ["#ed8722", "#ed8722"]
    }
  });

  $("#roundeddisability").circleProgress({
    value: 0.0,
    size: 150,
    thickness: 30,
    fill: {
      gradient: ["#ed8722", "#ed8722"]
    }
  });

  // Function selectPercent
  $(".vac-percent").click(function (e) {
    e.preventDefault();
    var percentValue = parseInt($(this).val());
    // Use a timestamp to identify the disability item
    var id = new Date().getTime();
    var selectedLimbLabel = $(".selectedlimb").text();
    $("#ulDisabilities").append(
      addItemToList(selectedLimb, selectedLimbLabel, percentValue, id)
    );
    deselectLimb();
    deselectPercent();
    if (limbHover) {
      limbHover.addClass("selectedLimbHover")
    }
    updatePercent();
    calculatePayment();
    updateLayout();
  });

  $(".vac-childrenunder18").on("change", "input[type=radio]", function (e) {
    $(".vac-childrenunder18 input[type=radio]").removeClass("selected");
    $(this).addClass("selected");
    childrenUnder18 = parseInt($(this).val());
    calculatePayment();
  });

  $(".vac-childover18").on("change", "input[type=radio]", function (e) {
    $(".vac-childover18 input[type=radio]").removeClass("selected");
    $(this).addClass("selected");
    children18to24 = parseInt($(this).val());
    calculatePayment();
  });

  $(".vac-maritalstatus").on("change", "input[type=radio]", function (e) {
    $(".vac-maritalstatus input[type=radio]").removeClass(
      "radio-button--selected"
    );
    $(this).addClass("radio-button--selected");
    maritalStatus = parseInt($(this).val());
    calculatePayment();
    if (maritalStatus === 1) {
      $(".vac-spouserequire__content").fadeIn(1000);
      updateLayout();
    } else {
      $(".vac-spouserequire__content").fadeOut(1000, () => {
        updateLayout();
      });
    }
  });

  $(".vac-parentsnum").on("change", "input[type=radio]", function (e) {
    $(".vac-parentsnum input[type=radio]").removeClass(
      "radio-button--selected"
    );
    $(this).addClass("radio-button--selected");
    dependentParents = parseInt($(this).val());
    calculatePayment();
  });

  $(".vac-spouserequire").on("change", "input[type=radio]", function (e) {
    $(".vac-spouserequire input[type=radio]").removeClass(
      "radio-button--selected"
    );
    $(this).addClass("radio-button--selected");
    spouseRequiresAid = parseInt($(this).val());
    calculatePayment();
  });

  //Function ulDisabilities remove
  $("#ulDisabilities").on("click", ".vac-remove-item", function () {
    if ($(this).attr("data-limb") == "leftarm") {
      $(".hoverLeftArm").removeClass("selectedLimbHover")
    }
    if ($(this).attr("data-limb") == "rightarm") {
      $(".hoverRightArm").removeClass("selectedLimbHover")
    }
    if ($(this).attr("data-limb") == "leftleg") {
      $(".hoverLeftLeg").removeClass("selectedLimbHover")
    }
    if ($(this).attr("data-limb") == "rightleg") {
      $(".hoverRightLeg").removeClass("selectedLimbHover")
    }
    var closeButton = $(this);
    function findDisabilityIndex(item) {
      var itemID = item.id.toString();
      var currentID = closeButton.attr("data-id");
      return itemID === currentID;
    }
    var index = disabilities.findIndex(findDisabilityIndex);
    disabilities.splice(index, 1);
    closeButton.parents("li").remove();
    limbHover = ""
    updatePercent();
    calculatePayment()
    updateLayout();
  });

  $(window).resize(checkMobileOnResize)
});
