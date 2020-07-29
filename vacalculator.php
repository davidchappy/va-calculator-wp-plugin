<?php
/*
   Plugin Name: VA Benefits Calculator
   Plugin URI: https://theincreasehunters.com
   description: Displays a VA Benefits Calculator via a [vacalculator] shortcode.
   Version: 1.0
   Author: ThreeLines Web
   Author URI: https://threelines.io
   License: GPL2
   */

function init_va_calculator_assets()
{
  wp_register_style('vacalculator_styles', plugins_url('css/style.css', __FILE__));
  wp_register_script('vacalculator_varates_2020', plugins_url('js/varates2020.js', __FILE__));
  wp_register_script('vacalculator_circle', plugins_url('js/circle-progress.min.js', __FILE__), array('jquery'));
  wp_register_script('vacalculator_scripts', plugins_url('js/script.js', __FILE__), array('jquery'));
}
add_action('wp_enqueue_scripts', 'init_va_calculator_assets');

function display_calculator_shortcode($atts)
{
  wp_enqueue_style('vacalculator_styles');
  wp_enqueue_script('vacalculator_varates_2020');
  wp_enqueue_script('vacalculator_circle');
  wp_enqueue_script('vacalculator_scripts');

  ob_start();

  $atts = array_change_key_case((array) $atts, CASE_LOWER);
?>

  <div class="vac-global-div">
    <header class="vac-header-section">
      <div class="vac-header-section__text">
        <h1 class="vac-hero-head">Enter your disabilities <br><span class="vac-hero-head--white">using the buttons below.</h1>
        <p class="vac-subtitle">If your disability is an extremity, then select that proper leg or arm button and then
          <br>select the percentage. If it is not, then just select the percentage.</p>
      </div>
    </header>
    <div class="vac-form-div">
      <form class="vac-form-class">
        <div class="tabs">
          <button role="presentation" id="leftarm" class="tablinks vac-limb hoverLeftArm">Left Arm</button>
          <button role="presentation" id="rightarm" class="tablinks vac-limb hoverRightArm">Right Arm</button>
          <button role="presentation" id="leftleg" class="tablinks vac-limb hoverLeftLeg">Left Leg</button>
          <button role="presentation" id="rightleg" class="tablinks vac-limb hoverRightLeg">Right Leg</button>
        </div>
        <div id="vac-disability-percentages">
          <input type="radio" id="ten_percent" class="hidden-radio vac-percent" name="percent_of_disability" value="10">
          <label for="ten_percent" class="radio-label">10%</label>
          <input type="radio" id="twenty_percent" class="hidden-radio vac-percent" name="percent_of_disability" value="20">
          <label for="twenty_percent" class="radio-label">20%</label>
          <input type="radio" id="thirty_percent" class="hidden-radio vac-percent" name="percent_of_disability" value="30">
          <label for="thirty_percent" class="radio-label">30%</label>
          <input type="radio" id="forty_percent" class="hidden-radio vac-percent" name="percent_of_disability" value="40">
          <label for="forty_percent" class="radio-label">40%</label>
          <input type="radio" id="fifty_percent" class="hidden-radio vac-percent" name="percent_of_disability" value="50">
          <label for="fifty_percent" class="radio-label">50%</label>
          <input type="radio" id="sixty_percent" class="hidden-radio vac-percent" name="percent_of_disability" value="60">
          <label for="sixty_percent" class="radio-label">60%</label>
          <input type="radio" id="seventy_percent" class="hidden-radio vac-percent" name="percent_of_disability" value="70">
          <label for="seventy_percent" class="radio-label">70%</label>
          <input type="radio" id="eighty_percent" class="hidden-radio vac-percent" name="percent_of_disability" value="80">
          <label for="eighty_percent" class="radio-label">80%</label>
          <input type="radio" id="ninety_percent" class="hidden-radio vac-percent" name="percent_of_disability" value="90">
          <label for="ninety_percent" class="radio-label">90%</label>
          <input type="radio" id="hundred_percent" class="hidden-radio vac-percent" name="percent_of_disability" value="100">
          <label for="hundred_percent" class="radio-label">100%</label>
        </div>
        <div class="row">
          <h2 class="vac-headertext">Disability List</h2>
          <p class="vac-click-to-remove"><em>(click to remove)</em></p>
          <div class="col-md-8 col-md-offset-2 vac-disability">
            <ul id="ulDisabilities" class="list-group list-group-horizontal text-center"></ul>
          </div>
          <hr class="vac-divider" />
        </div>
        <div class="vac-children">
          <div class="vac-childrenunder18">
            <p class="vac-dependents-text">How many dependent children do you have under the age of 18?</p>
            <div class="vac-childrenunder18__radio-buttons">
              <label for="zero_child_young" class="vac-calcpayout"><input type="radio" id="zero_child_young" name="dependent_children_young" value="0">0</label>
              <label for="one_child_young" class="vac-calcpayout"><input type="radio" id="one_child_young" name="dependent_children_young" value="1">1</label>
              <label for="two_child_young" class="vac-calcpayout"><input type="radio" id="two_child_young" name="dependent_children_young" value="2">2</label>
              <label for="three_child_young" class="vac-calcpayout"><input type="radio" id="three_child_young" name="dependent_children_young" value="3">3</label>
              <label for="four_child_young" class="vac-calcpayout"><input type="radio" id="four_child_young" name="dependent_children_young" value="4">4</label>
              <label for="five_child_young" class="vac-calcpayout"><input type="radio" id="five_child_young" name="dependent_children_young" value="5">5</label>
              <label for="six_child_young" class="vac-calcpayout"><input type="radio" id="six_child_young" name="dependent_children_young" value="6">6</label>
              <label for="seven_child_young" class="vac-calcpayout"><input type="radio" id="seven_child_young" name="dependent_children_young" value="7">7</label>
              <label for="eight_child_young" class="vac-calcpayout"><input type="radio" id="eight_child_young" name="dependent_children_young" value="8">8</label>
              <label for="nine_child_young" class="vac-calcpayout"><input type="radio" id="nine_child_young" name="dependent_children_young" value="9">9</label>
              <label for="ten_child_young" class="vac-calcpayout"><input type="radio" id="ten_child_young" name="dependent_children_young" value="10">10</label>
            </div>
          </div>
          <div class="vac-childover18">
            <p class="vac-dependents-text">How many dependent children do you have between 18 and 24?</p>
            <div class="vac-childover18__radio-buttons">
              <label for="zero_child_old" class="vac-calcpayout-old"><input type="radio" id="zero_child_old" name="dependent_children_old" value="0">0</label>
              <label for="one_child_old" class="vac-calcpayout-old"><input type="radio" id="one_child_old" name="dependent_children_old" value="1">1</label>
              <label for="two_child_old" class="vac-calcpayout-old"><input type="radio" id="two_child_old" name="dependent_children_old" value="2">2</label>
              <label for="three_child_old" class="vac-calcpayout-old"><input type="radio" id="three_child_old" name="dependent_children_old" value="3">3</label>
              <label for="four_child_old" class="vac-calcpayout-old"><input type="radio" id="four_child_old" name="dependent_children_old" value="4">4</label>
              <label for="five_child_old" class="vac-calcpayout-old"><input type="radio" id="five_child_old" name="dependent_children_old" value="5">5</label>
              <label for="six_child_old" class="vac-calcpayout-old"><input type="radio" id="six_child_old" name="dependent_children_old" value="6">6</label>
              <label for="seven_child_old" class="vac-calcpayout-old"><input type="radio" id="seven_child_old" name="dependent_children_old" value="7">7</label>
              <label for="eight_child_old" class="vac-calcpayout-old"><input type="radio" id="eight_child_old" name="dependent_children_old" value="8">8</label>
              <label for="nine_child_old" class="vac-calcpayout-old"><input type="radio" id="nine_child_old" name="dependent_children_old" value="9">9</label>
              <label for="ten_child_old" class="vac-calcpayout-old"><input type="radio" id="ten_child_old" name="dependent_children_old" value="10">10</label>
            </div>
          </div>
        </div>
        <hr class="vac-divider">
        <div class="vac-relationships">
          <div class="vac-row">
            <div class="vac-maritalstatus vac-half">
              <p>What is your marital status?</p>
              <div class="vac-maritalstatus__buttons">
                <input type="radio" class="vac-radio_button-marriage hidden-radio" id="single" name="marital_status" value="0">
                <label for="single" class="vac-label-button-marriage radio-label">Single</label>
                <input type="radio" class="vac-radio_button-marriage hidden-radio" id="married" name="marital_status" value="1">
                <label for="married" class="vac-label-button-marriage radio-label">Married</label>
              </div>
            </div>
            <div class="vac-parentsnum vac-half">
              <p>How many dependent parents do you have?</p>
              <div class="vac-parents__buttons">
                <input type="radio" class="vac-radio_button-parents hidden-radio" id="no_parent" name="dependent_parents" value="0">
                <label for="no_parent" class="vac-label-button-parents radio-label">None</label>
                <input type="radio" class="vac-radio_button-parents hidden-radio" id="one_parent" name="dependent_parents" value="1">
                <label for="one_parent" class="vac-label-button-parents radio-label">One</label>
                <input type="radio" class="vac-radio_button-parents hidden-radio" id="two_parent" name="dependent_parents" value="2">
                <label for="two_parent" class="vac-label-button-parents radio-label">Two</label>
              </div>
            </div>
          <div class="vac-spouserequire">
            <div class="vac-spouserequire__content hidden">
              <p>Does your spouse require Aid and Attendance(A/A)?</p>
              <div class="vac-spouserequire__buttons">
                <input type="radio" class="vac-radio_button-spouse hidden-radio" id="no_requires" name="spouse_aid" value="0">
                <label for="no_requires" class="vac-label-button-spouse radio-label">No</label>
                <input type="radio" class="vac-radio_button-spouse hidden-radio" id="yes_requires" name="spouse_aid" value="1">
                <label for="yes_requires" class="vac-label-button-spouse radio-label">Yes</label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
      <div class="vac-left-grid-area">
        <div class="vac-column-total">
          <h2 class="vac-disability_percentage_title">Combined disability percentage</h2>
        </div>
        <div class="vac-circle" id="totaldisability">
          <span id="disabilityvalue" class="vac-value">0%</span>
        </div>
        <div class="vac-bilateral-factor hidden" id="bilateral-rate">
          <h4>* A Bilateral factor of <span id="bilateral-factor-value"></span> was applied.</h4>
        </div>
      </div>
    </div>
    <div class="vac-bottom-half">
      <div class="vac-content-width">
        <div class="vac-column-rounded">
          <h3 class="vac-current-disability">Current Disability Rating</h3>
          <div class="vac-circle" id="roundeddisability">
            <span id="roundeddisabilityvalue" class="vac-value">0%</span>
          </div>
        </div>
        <div class="vac-column-moneytotal">
          <h3>Your monthly payment amount is</h3>
          <div id="vac-divmoneytotal">
            <span id="spnmoneytotal" class="vac-moneytotal">
              $<span class="vac-moneytotal__dollars">0</span>
            </span>
            <p class="vac-employability-message hidden">With your rating, if you're not working, you should be receiving 100% VA disability through
              unemployability
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="vac-footer">
      <div class="vac-content-width">
        <h3 class="vac-bottom-title"><strong>Do VA disabilities keep you from working?</strong></h3>
        <p>If so, you should be rated at 100%.</p>
        <button type="button" class="vac-bottom-button">Click Here for a FREE Case Evaluation</button>
      </div>
    </div>
  </div>
<?php

  return ob_get_clean();
}
add_shortcode("vacalculator", "display_calculator_shortcode");
?>