import React from 'react';
import WhenAndWhere from '../components/WhenAndWhere';

export const formattedSteps = () => {
  let formattedQuestions = [];
  for (var index = 0; index < Questions.length; index++) {
    let question = Questions[index],
        user = true,
        waitAction = true,
        end = false;
        id = String(index * 2 + 1)
        trigger = String(index * 2 + 2);
        userTrigger = String(index * 2 + 3);

    if (index === Questions.length -1) end = true;

    let formatMessage = (values) => {
      if (values) {
        const { previousValue, steps } = values;
        console.log(steps);
        return (steps && steps['2'])
        ? question.question.replace('<city>', steps['2'].message.trim())
        : question.question
      }
      return question.question
    }

    formattedQuestions.push({
      id, trigger,
      message: formatMessage,
    });

    if (!question.open) {
      if (question.options){
        let options = question.options.map((opt) => {
          return {value: opt, label: opt, trigger: userTrigger};
        });
        if (end) formattedQuestions.push({id: trigger, end, options});
        else formattedQuestions.push({id: trigger, options});
      }
      if (question.component) {
        let { component } = question;
        if (end) formattedQuestions.push({id: trigger, end, component, waitAction});
        else formattedQuestions.push({id: trigger, component, waitAction});
      }
    }
    else {
      if (end) formattedQuestions.push({id: trigger, end, user});
      else {
        formattedQuestions.push({id: trigger, trigger: userTrigger, user});}
    }
  }
  return formattedQuestions;
}

export default Questions = [
  {
    question: 'Hi! thanks for using Odyssey! Let\'s get started building your itinerary.\n\nWhat city do you want to travel to?',
    open: true,
  },
  {
    question: 'Select below when you want to take this trip. When you are finished selecting the dates, press "Done"',
    component: <WhenAndWhere />
  },
  {
    question:'How many times have you been to <city>?',
    options:[
      'Never',
      'Once',
      'Twice',
      'Multiple Times',
      'I basically live here',
    ]
  },
  {
    question:'How many people will you be traveling with?',
    options:[
      'Solo Trip',
      '1','2','3','4+',
    ],
  },
  {
    question:'What kind of pace do you want to have?',
    options:[
      'Relaxing',
      'Moderate',
      'Active',
      'Non-Stop',
    ],
  },
  {
    question:'How much do you typically spend (per person) on a meal?',
    options:[
      '$20 or less',
      '$21 - $40',
      '$41 - $50',
      '$51 - $100',
      '$100+',
    ],
  },
  {
    question:'Do you already have anything specific planned for this trip?',
    open: true,
  },
  {
    question:'Is there anything that you cannot miss in <city>? \n(For example: in NYC the Statue of Liberty)',
    open: true,
  },
  {
    question:'Is there anything else about your travel preferences that you would like us to know?',
    open: true,
  },
];
export const PreferenceQuestions = [
  {
    question:'What types of experiences would you like to have on this trip?',
    open: false,
    options:[
      'Food Related',
      'Culture Related',
      'Nightlife',
      'Historical/Iconic',
      'Local',
      'Music Related',
      'Art Related',
    ]
  },
  {
    question:'What kind of food do you enjoy?',
    open: false,
    options:[
      'American',
      'Anything',
      'Chinese',
      'Comfort Food',
      'Italian',
      'Korean',
      'French',
      'Japanese',
      'Southern',
      'Thai',
      'Spanish',
      'Seafood',
      'Nordic',
      'Indian',
      'Ethiopian',
    ],
  }
]
