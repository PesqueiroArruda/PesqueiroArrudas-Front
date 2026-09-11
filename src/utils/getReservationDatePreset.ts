import { DateTime } from 'luxon';

export type ReservationDatePresetKey = 'today' | 'next7days' | 'thisMonth';

export interface ReservationDateRange {
  from: string;
  to: string;
}

export function getReservationDatePreset(
  preset: ReservationDatePresetKey,
  reference: DateTime = DateTime.now()
): ReservationDateRange {
  switch (preset) {
    case 'today': {
      const today = reference.toISODate() as string;
      return { from: today, to: today };
    }
    case 'next7days':
      return {
        from: reference.toISODate() as string,
        to: reference.plus({ days: 7 }).toISODate() as string,
      };
    case 'thisMonth':
      return {
        from: reference.startOf('month').toISODate() as string,
        to: reference.endOf('month').toISODate() as string,
      };
    default:
      throw new Error(`Unknown reservation date preset: ${preset}`);
  }
}
