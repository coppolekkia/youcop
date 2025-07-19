import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Filter, X, Calendar, Eye, Clock, SortAsc } from 'lucide-react';

export interface FilterOptions {
  sortBy: 'newest' | 'oldest' | 'mostViewed' | 'leastViewed' | 'relevance';
  uploadDate: 'all' | 'hour' | 'today' | 'week' | 'month' | 'year';
  duration: 'all' | 'short' | 'medium' | 'long'; // <4min, 4-20min, >20min
  viewCount: 'all' | 'low' | 'medium' | 'high'; // <100k, 100k-1M, >1M
}

interface VideoFiltersProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  onClearFilters: () => void;
  totalVideos: number;
}

export function VideoFilters({ filters, onFiltersChange, onClearFilters, totalVideos }: VideoFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const updateFilter = <K extends keyof FilterOptions>(key: K, value: FilterOptions[K]) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.sortBy !== 'relevance') count++;
    if (filters.uploadDate !== 'all') count++;
    if (filters.duration !== 'all') count++;
    if (filters.viewCount !== 'all') count++;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  const getSortByLabel = (value: string) => {
    const labels = {
      relevance: 'Rilevanza',
      newest: 'Più recenti',
      oldest: 'Più vecchi',
      mostViewed: 'Più visti',
      leastViewed: 'Meno visti'
    };
    return labels[value as keyof typeof labels] || value;
  };

  const getUploadDateLabel = (value: string) => {
    const labels = {
      all: 'Tutte le date',
      hour: 'Ultima ora',
      today: 'Oggi',
      week: 'Questa settimana',
      month: 'Questo mese',
      year: 'Quest\'anno'
    };
    return labels[value as keyof typeof labels] || value;
  };

  const getDurationLabel = (value: string) => {
    const labels = {
      all: 'Tutte le durate',
      short: 'Brevi (meno di 4 min)',
      medium: 'Medie (4-20 min)',
      long: 'Lunghi (più di 20 min)'
    };
    return labels[value as keyof typeof labels] || value;
  };

  const getViewCountLabel = (value: string) => {
    const labels = {
      all: 'Tutte le visualizzazioni',
      low: 'Poche (meno di 100K)',
      medium: 'Medie (100K-1M)',
      high: 'Molte (più di 1M)'
    };
    return labels[value as keyof typeof labels] || value;
  };

  return (
    <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="px-3 sm:px-6 py-3 sm:py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-3 sm:mb-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-2 text-xs sm:text-sm"
            >
              <Filter className="w-3 h-3 sm:w-4 sm:h-4" />
              Filtri
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="ml-1 text-xs">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
            <span className="text-xs sm:text-sm text-muted-foreground">
              {totalVideos} video{totalVideos !== 1 ? 's' : ''}
            </span>
          </div>
          
          {activeFiltersCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="flex items-center gap-2 text-xs sm:text-sm"
            >
              <X className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Cancella filtri</span>
              <span className="sm:hidden">Cancella</span>
            </Button>
          )}
        </div>

        {/* Quick Sort Filter - Always Visible */}
        <div className="flex items-center gap-2 mb-3">
          <SortAsc className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground" />
          <Select value={filters.sortBy} onValueChange={(value) => updateFilter('sortBy', value as FilterOptions['sortBy'])}>
            <SelectTrigger className="w-full sm:w-[180px] text-xs sm:text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevance">Rilevanza</SelectItem>
              <SelectItem value="newest">Più recenti</SelectItem>
              <SelectItem value="oldest">Più vecchi</SelectItem>
              <SelectItem value="mostViewed">Più visti</SelectItem>
              <SelectItem value="leastViewed">Meno visti</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Expanded Filters */}
        {isExpanded && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 pt-3 border-t">
            {/* Upload Date Filter */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground" />
                <label className="text-xs sm:text-sm font-medium">Data di caricamento</label>
              </div>
              <Select value={filters.uploadDate} onValueChange={(value) => updateFilter('uploadDate', value as FilterOptions['uploadDate'])}>
                <SelectTrigger className="text-xs sm:text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tutte le date</SelectItem>
                  <SelectItem value="hour">Ultima ora</SelectItem>
                  <SelectItem value="today">Oggi</SelectItem>
                  <SelectItem value="week">Questa settimana</SelectItem>
                  <SelectItem value="month">Questo mese</SelectItem>
                  <SelectItem value="year">Quest'anno</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Duration Filter */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground" />
                <label className="text-xs sm:text-sm font-medium">Durata</label>
              </div>
              <Select value={filters.duration} onValueChange={(value) => updateFilter('duration', value as FilterOptions['duration'])}>
                <SelectTrigger className="text-xs sm:text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tutte le durate</SelectItem>
                  <SelectItem value="short">Brevi (meno di 4 min)</SelectItem>
                  <SelectItem value="medium">Medie (4-20 min)</SelectItem>
                  <SelectItem value="long">Lunghi (più di 20 min)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* View Count Filter */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Eye className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground" />
                <label className="text-xs sm:text-sm font-medium">Visualizzazioni</label>
              </div>
              <Select value={filters.viewCount} onValueChange={(value) => updateFilter('viewCount', value as FilterOptions['viewCount'])}>
                <SelectTrigger className="text-xs sm:text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tutte le visualizzazioni</SelectItem>
                  <SelectItem value="low">Poche (meno di 100K)</SelectItem>
                  <SelectItem value="medium">Medie (100K-1M)</SelectItem>
                  <SelectItem value="high">Molte (più di 1M)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {/* Active Filters Display */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t">
            {filters.sortBy !== 'relevance' && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Ordine: {getSortByLabel(filters.sortBy)}
                <X 
                  className="w-3 h-3 cursor-pointer" 
                  onClick={() => updateFilter('sortBy', 'relevance')}
                />
              </Badge>
            )}
            {filters.uploadDate !== 'all' && (
              <Badge variant="secondary" className="flex items-center gap-1">
                {getUploadDateLabel(filters.uploadDate)}
                <X 
                  className="w-3 h-3 cursor-pointer" 
                  onClick={() => updateFilter('uploadDate', 'all')}
                />
              </Badge>
            )}
            {filters.duration !== 'all' && (
              <Badge variant="secondary" className="flex items-center gap-1">
                {getDurationLabel(filters.duration)}
                <X 
                  className="w-3 h-3 cursor-pointer" 
                  onClick={() => updateFilter('duration', 'all')}
                />
              </Badge>
            )}
            {filters.viewCount !== 'all' && (
              <Badge variant="secondary" className="flex items-center gap-1">
                {getViewCountLabel(filters.viewCount)}
                <X 
                  className="w-3 h-3 cursor-pointer" 
                  onClick={() => updateFilter('viewCount', 'all')}
                />
              </Badge>
            )}
          </div>
        )}
      </div>
    </div>
  );
}