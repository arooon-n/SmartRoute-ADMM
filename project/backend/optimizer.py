def admm_schedule(passenger_counts, routes, num_buses, distances, fuel_efficiency):
    import numpy as np

    print(f"[DEBUG] ADMM Input - Passenger Counts: {passenger_counts}")
    print(f"[DEBUG] ADMM Input - Routes: {routes}")
    print(f"[DEBUG] ADMM Input - Total Buses: {num_buses}")
    print(f"[DEBUG] ADMM Input - Distances: {distances}")
    print(f"[DEBUG] ADMM Input - Fuel Efficiency: {fuel_efficiency}")

    route_list = list(routes.keys())
    route_scores = []

    for route_name in route_list:
        stop_indices = routes[route_name]
        demand = sum(passenger_counts[i] for i in stop_indices)
        cost = sum(distances[i] / fuel_efficiency for i in stop_indices)
        score = demand / (cost + 1e-6)
        route_scores.append(score)

    route_scores = np.array(route_scores)

    # ADMM setup
    x = np.zeros_like(route_scores)  # primal variables: buses assigned
    z = np.zeros_like(route_scores)  # consensus variable
    u = np.zeros_like(route_scores)  # dual variable
    rho = 1.0
    MAX_ITER = 100

    total_score = np.sum(route_scores)

    if total_score == 0:
        return {"routes": {r: 0 for r in route_list}, "idle_buses": num_buses}

    for _ in range(MAX_ITER):
        # x-update: local assignment
        x = route_scores / (np.sum(route_scores)) * num_buses - u

        # z-update: consensus (project to feasible space)
        z_old = z.copy()
        z = (x + u)
        z[z < 0] = 0
        z = z / np.sum(z) * num_buses

        # u-update: dual variable
        u = u + (x - z)

        # convergence check (optional)
        if np.linalg.norm(z - z_old) < 1e-2:
            break

    # Convert z to integer allocation
    final_allocation = {route_list[i]: int(round(z[i])) for i in range(len(route_list))}
    total_assigned = sum(final_allocation.values())

    # Adjust for over-allocation
    if total_assigned > num_buses:
        print(f"[DEBUG] Over-allocation detected. Adjusting allocation...")
        excess = total_assigned - num_buses
        for route in sorted(final_allocation, key=lambda r: final_allocation[r], reverse=True):
            if excess <= 0:
                break
            reduction = min(final_allocation[route], excess)
            final_allocation[route] -= reduction
            excess -= reduction

    # Recalculate idle buses
    total_assigned = sum(final_allocation.values())
    idle_buses = num_buses - total_assigned

    print(f"[DEBUG] ADMM Allocation: {final_allocation}")
    print(f"[DEBUG] Idle Buses: {idle_buses}")

    return {"routes": final_allocation, "idle_buses": idle_buses}