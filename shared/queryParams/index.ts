// FILE ____________ FullstackFinalProject/shared/queryFilters/index.ts

// Export the types
export type FilterOperator = '=' | '>' | '<' | '>=' | '<=' | '!=' | 'contains' | 'startsWith' | 'endsWith';

// FilterValue represents possible values for any filter
export type FilterValue = string | number | boolean | Date | null;

// Define a mapped type for query parameters
export interface QueryFilters {
  [key: string]: FilterValue | { [operator in FilterOperator]?: FilterValue };
}

// Create a function to parse query parameters into Prisma filters
export function parseFilters(queryParams: Record<string, any>): QueryFilters {
  const parsedFilters: QueryFilters = {};
  
  for (const [key, value] of Object.entries(queryParams)) {
    // Handle special operators
    if (typeof value === 'string') {
      if (value.startsWith('>=')) {
        parsedFilters[key] = { '>=': value.substring(2) };
      } else if (value.startsWith('<=')) {
        parsedFilters[key] = { '<=': value.substring(2) };
      } else if (value.startsWith('>')) {
        parsedFilters[key] = { '>': value.substring(1) };
      } else if (value.startsWith('<')) {
        parsedFilters[key] = { '<': value.substring(1) };
      } else if (value.startsWith('!=') || value.startsWith('=!')) {
        parsedFilters[key] = { '!=': value.substring(2) };
      } else if (value.startsWith('contains:')) {
        parsedFilters[key] = { 'contains': value.substring(9) };
      } else {
        // Default is exact match
        parsedFilters[key] = value;
      }
    } else {
      parsedFilters[key] = value;
    }
  }
  
  return parsedFilters;
}
/** USAGE EXAMPLE
// import { parseFilters, QueryFilters } from '../../shared/queryFilters';
// const filters: QueryFilters = parseFilters(req.query);
...
// const filteredData = await prisma.user.findMany({
//   where: filters,
// });
 
 */
