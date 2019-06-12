import React from 'react';
import { Text } from 'native-base';
import WhenAndWhere from '../components/WhenAndWhere';

export const formattedSteps = (questions) => {
  let formattedQuestions = [];
  for (var index = 0; index < questions.length; index++) {
    let question = questions[index],
        user = true,
        waitAction = true,
        end = false;
        id = String(index * 2 + 1)
        trigger = String(index * 2 + 2);
        userTrigger = String(index * 2 + 3);

    if (index === questions.length -1) end = true;

    let formatMessage = (values) => {
      if (values) {
        const { previousValue, steps } = values;
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
        component = (component === '<WhenAndWhere/>')
          ? <WhenAndWhere/>
          : <Text>{component}</Text>;
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
