export interface ReservationConflictInput {
  id: string;
  reservationDate: string;
  reservationTime: string;
  environment: string;
  paymentStatus: string;
}

export function findReservationConflicts(reservations: ReservationConflictInput[]): Set<string> {
  const groups = new Map<string, string[]>();

  reservations
    .filter((reservation) => reservation.paymentStatus === 'paid')
    .forEach((reservation) => {
      const key = `${reservation.reservationDate}|${reservation.reservationTime}|${reservation.environment}`;
      const group = groups.get(key) || [];
      group.push(reservation.id);
      groups.set(key, group);
    });

  const conflictIds = new Set<string>();
  groups.forEach((ids) => {
    if (ids.length > 1) {
      ids.forEach((id) => conflictIds.add(id));
    }
  });

  return conflictIds;
}
