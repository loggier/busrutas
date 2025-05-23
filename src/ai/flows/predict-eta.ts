'use server';
/**
 * @fileOverview Predicts the estimated time of arrival (ETA) at upcoming control points.
 *
 * - predictETA - A function that predicts the ETA at upcoming control points.
 * - PredictETAInput - The input type for the predictETA function.
 * - PredictETAOutput - The return type for the predictETA function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PredictETAInputSchema = z.object({
  currentLocation: z
    .string()
    .describe('The current location of the unit.'),
  upcomingControlPoints: z
    .array(z.string())
    .describe('A list of upcoming control points.'),
  currentTime: z.string().describe('The current time.'),
  historicalData: z
    .string()
    .describe(
      'Historical data of travel times between control points, including date, time, and duration.'
    ),
});
export type PredictETAInput = z.infer<typeof PredictETAInputSchema>;

const PredictETAOutputSchema = z.object({
  estimatedArrivalTimes: z
    .array(z.string())
    .describe('A list of estimated arrival times for each upcoming control point.'),
  delayReasons: z
    .string() // Changed to string to hold the reason for the potential delay.
    .describe(
      'Any potential reasons for delays, such as traffic or road closures.'
    ),
});
export type PredictETAOutput = z.infer<typeof PredictETAOutputSchema>;

export async function predictETA(input: PredictETAInput): Promise<PredictETAOutput> {
  return predictETAFlow(input);
}

const prompt = ai.definePrompt({
  name: 'predictETAPrompt',
  input: {schema: PredictETAInputSchema},
  output: {schema: PredictETAOutputSchema},
  prompt: `You are an AI assistant designed to predict the estimated time of arrival (ETA) at upcoming control points for a transportation unit. Use the provided historical data and current conditions to make accurate predictions.

Current Location: {{{currentLocation}}}
Upcoming Control Points: {{#each upcomingControlPoints}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
Current Time: {{{currentTime}}}
Historical Data: {{{historicalData}}}

Analyze the historical data and current conditions to predict the ETA for each upcoming control point. Consider potential delays due to traffic, road closures, or other factors.  Provide a delayReasons string with any potential reasons for delay.

Format the estimated arrival times as a list of strings, corresponding to the order of the upcoming control points.
`,
});

const predictETAFlow = ai.defineFlow(
  {
    name: 'predictETAFlow',
    inputSchema: PredictETAInputSchema,
    outputSchema: PredictETAOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
