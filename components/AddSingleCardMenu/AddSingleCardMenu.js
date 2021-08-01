import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import { useSelector, useDispatch } from 'react-redux';
import menuStyles from '../../util/design/ActionMenus.module.scss';
import componentStyles from './AddSingleCardMenu.module.scss';
const styles = { ...componentStyles, ...menuStyles };

// Components
import LoadingSpinner from '../Icons/LoadingSpinner';

// Utility functions
import { setCollectedItems, setCollectionDetails, setActionModalStatus } from '../../redux/actionCreators';
import { getNowAsStringWithTime } from '../../util/helpers/date';
import collectedItem from '../../util/api/collection';
import pokeCard from '../../util/api/card';
import analytics from '../../util/analytics/segment';


export default function AddSingleCardMenu({ }) {
  // Finishes
  const [selectedFinish, setSelectedFinish] = useState('holo'); // holo, non-holo, reverse_holo
  const [availableFinishes, setAvailableFinishes] = useState([]);
  // Grades
  const [gradingAuthority, setGradingAuthority] = useState('Ungraded');
  const [grade, setGrade] = useState(10);
  const [showHalfGrades, setShowHalfGrades] = useState(false);
  const [possibleGrades, setPossibleGrades] = useState([]);
  // Variants
  const [showVariants, setShowVariants] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState('first_edition'); // first_edition, shadowless, unlimited
  const [availableVariants, setAvailableVariants] = useState(['first_edition', 'shadowless', 'unlimited']);
  // Submission status
  const [submitted, setSubmitted] = useState(false);
  // Set
  const [setForCard, setSetForCard] = useState({});
  // Redux
  const user = useSelector(state => state.user);
  const card = useSelector(state => state.focusedCard);
  const dispatch = useDispatch();

  const finishMap = {
    'non-holo': 'Non-holo',
    'reverse_holo': 'Reverse holo',
    'holo': 'Holo'
  }

  const variantMap = {
    'shadowless': 'Shadowless',
    'first_edition': '1st Edition',
    'unlimited': 'Unlimited',
  }

  const graders = ['Ungraded', 'PSA', 'BGS', 'CGC', 'GMA', 'SGC'];

  const getGrades = () => {
    let grades = [];
    let startingNum = 10;

    if (gradingAuthority === 'PSA') {
      setGrade(Math.ceil(grade));
    } else {
      startingNum = showHalfGrades ? 9.5 : 10;
      let selectedGrade = grade;

      if (showHalfGrades && Number.isInteger(grade)) {
        selectedGrade = grade - 0.5;
        selectedGrade = selectedGrade < 1 ? 1 : selectedGrade;
      } else if (!showHalfGrades && !Number.isInteger(grade)) {
        selectedGrade = grade + 0.5;
        selectedGrade = selectedGrade > 10 ? 10 : selectedGrade;
      }

      setGrade(selectedGrade);
    }

    for (let i = startingNum; i >= 1; i--) {
      grades.push(i);
    }

    setPossibleGrades(grades)
  }

  const getCollectedItems = async () => {
    let item_details = await collectedItem.getForUser(user.id);
    dispatch(setCollectionDetails(item_details));

    let itemsToGet = item_details.map(detail => detail.item_id);
    let items = await pokeCard.getMultiple(itemsToGet);
    let itemLookup = {};
    items.forEach(item => {
      itemLookup[item.id] = item;
    })
    dispatch(setCollectedItems(itemLookup));
    Promise.resolve(true);
  }

  const handleSave = async () => {
    try {
      let graded = gradingAuthority !== 'Ungraded';
      setSubmitted(true);
      let item = {
        user_id: user.id,
        item_id: card.id,
        collection_id: 'pokemon_cards',
        date_added: getNowAsStringWithTime(),
        finish: null,
        version: null,
        grading_authority: graded ? gradingAuthority : null,
        grade: graded ? grade : null,
        type: 'pokemon'
      }

      await collectedItem.create(item);
      await getCollectedItems();

      analytics.track({
        userId: user.id,
        event: 'Added card to collection'
      });

      dispatch(setActionModalStatus(''));
    } catch(error) {
      console.error(error);
    }
  }

  const determineFinishes = () => {
    let finishes = [];
    let allFinishes = ['holo', 'reverse_holo', 'non-holo'];
    if (card.full_art) {
      finishes.push('holo');
    } else {
      finishes = allFinishes;
    }

    setAvailableFinishes(finishes);
    setSelectedFinish(finishes[0]);
  }

  const determineVariants = () => {
    let shouldShowVariants = false;
    let variants = [];
    let allVariants = ['first_edition', 'shadowless', 'unlimited'];

    if (setForCard.has_first_edition) {
      variants.push('first_edition');
    }

    if (setForCard.has_shadowless) {
      variants.push('shadowless');
    }

    if (setForCard.has_first_edition || setForCard.has_shadowless) {
      shouldShowVariants = true;
      variants.push('unlimited');
    }

    setShowVariants(shouldShowVariants);
    setAvailableVariants(variants);
    if (variants.length > 0) {
      setSelectedVariant(variants[0]);
    }
  }

  useEffect(getGrades, [gradingAuthority, showHalfGrades]);
  useEffect(determineFinishes, [card]);
  useEffect(determineVariants, []);

  return (
    <div className={classNames(styles.contentWrapper, styles.container)}>
      <div className={styles.mainContent}>
        <h3 className={styles.title}>{card.name}</h3>

        <div className={styles.buttonSection}>
          <p className={classNames(styles.label, styles.labelBottomMargin)}>Finish</p>
          <div className={styles.flexRow}>
            { availableFinishes.map(finish => {
              return (
                <div className={classNames(styles.smallButton, styles.buttonMarginRight, { [styles.buttonSelected]: selectedFinish === finish })} onClick={() => setSelectedFinish(finish)} key={finish}>
                  <span>{finishMap[finish]}</span>
                </div>
              )
            })}
          </div>
        </div>

        <div className={styles.buttonSection}>
          <p className={classNames(styles.label, styles.labelBottomMargin)}>Grading</p>
          <div className={styles.flexWrapRow}>
            { graders.map((grader) => {
              return (
                <div className={classNames(styles.smallButton, styles.buttonMarginRight, { [styles.buttonSelected]: gradingAuthority === grader })} onClick={() => setGradingAuthority(grader)} key={grader}>
                  <span>{grader}</span>
                </div>
              )
            })}
          </div>

          {/* { gradingAuthority === 'Other' &&
            <input
              type='text'
              value={otherGrader}
              className={styles.otherGraderInput}
              onChange={event => setOtherGrader(event.target.value)}
              placeholder='Grader...'
            />
          } */}
        </div>

        { gradingAuthority !== 'Ungraded' &&
          <div className={classNames(styles.buttonSection, styles.flexColumn, { [styles.notVisible]: gradingAuthority.length === 0 })}>
            <p className={classNames(styles.label, styles.labelBottomMargin)}>Grade</p>
            <div className={classNames(styles.flexWrapRow)}>
              { possibleGrades.map(possibleGrade => {
                return (
                  <div className={classNames(styles.smallButton, styles.gradeButton, { [styles.buttonSelected]: possibleGrade === grade })} onClick={() => setGrade(possibleGrade)} key={possibleGrade}>
                    <span>{possibleGrade}</span>
                  </div>
                )
              })}
            </div>

            { gradingAuthority !== 'PSA' &&
              <div className={classNames(styles.smallButton, styles.halfGradeButton, { [styles.buttonSelected]: showHalfGrades })} onClick={() => setShowHalfGrades(!showHalfGrades)}>
                <span>Show .5 grades</span>
              </div>
            }
          </div>
        }

        { showVariants &&
          <div className={styles.buttonSection}>
            <p className={classNames(styles.label, styles.labelBottomMargin)}>Variant</p>
            <div className={styles.flexRow}>
              { availableVariants.map(variant => {
                return (
                  <div className={classNames(styles.smallButton, styles.buttonMarginRight, { [styles.buttonSelected]: selectedVariant === variant })} onClick={() => setSelectedVariant(variant)} key={variant}>
                    <span>{variantMap[variant]}</span>
                  </div>
                )
              })}
            </div>
          </div>
        }
      </div>

      <div className={styles.bottomButtonWrapper}>
        <div className={styles.bottomButton} onClick={!submitted ? handleSave : null}>
          { !submitted
            ? <span>Add to collection</span>
            : <LoadingSpinner />
          }

        </div>
      </div>

    </div>
  );
}
