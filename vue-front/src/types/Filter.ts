export interface FilterMetadata {
  value: any;
  matchMode: string;
}


export interface Filter {
  first? : number;
  rows? : number;
  page? : number;
  sortField? : string;
  sortOrder? : string;
  filters? : Record<string, FilterMetadata>;

}
export class FilterParser {
  

  public toUriParams(filter : Filter): string {
    const params1 = new URLSearchParams();
    if(filter.page){
      params1.append("page", String(filter.page));
    }

    if(filter && filter.sortField){
      let sort = String(filter.sortField)+","+(filter.sortOrder == '1' ? "asc" : "desc")
      params1.append("sort", sort);
    }

    if(filter.rows){
      params1.append("limit", String(filter.rows))
    }
    if(filter && filter.filters){
      
      Object.keys(filter.filters).forEach(key => {
        if(filter.filters[key].value){
          params1.append(key, filter.filters[key].value);
        }
      });
    }

    return "?"+params1.toString();
  }

}


