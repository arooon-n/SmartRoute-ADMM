def admm_schedule(passenger_counts, routes, num_buses, distances, fuel_efficiency):
    """
    ADMM-based scheduler to allocate buses dynamically based on passenger demand.
    Includes constraints like distance and fuel efficiency.
    """
    print(f"[DEBUG] ADMM Input - Passenger Counts: {passenger_counts}")
    print(f"[DEBUG] ADMM Input - Routes: {routes}")
    print(f"[DEBUG] ADMM Input - Total Buses: {num_buses}")
    print(f"[DEBUG] ADMM Input - Distances: {distances}")
    print(f"[DEBUG] ADMM Input - Fuel Efficiency: {fuel_efficiency}")

    route_scores = {}
    for route_name, stop_indices in routes.items():
        # Calculate total demand for the route
        total_demand = sum(passenger_counts[i - 1] for i in stop_indices)  # Adjust for 0-based indexing
        # Calculate cost based on distance and fuel efficiency
        cost = sum(distances[i - 1] / fuel_efficiency for i in stop_indices)
        # Higher demand and lower cost increase the score
        route_scores[route_name] = total_demand / (cost + 1e-6)

    print(f"[DEBUG] Route Scores: {route_scores}")

    # Normalize scores to allocate buses
    total_score = sum(route_scores.values())
    bus_allocation = {}

    if total_score == 0:
        # No demand anywhere: all buses idle
        for route in routes:
            bus_allocation[route] = 0
        return {"routes": bus_allocation, "idle_buses": num_buses}

    for route, score in route_scores.items():
        bus_allocation[route] = round((score / total_score) * num_buses)

    # Adjust for rounding errors
    assigned = sum(bus_allocation.values())
    idle_buses = num_buses - assigned
    if idle_buses < 0:
        # Over-assigned due to rounding: reduce from max route
        max_route = max(bus_allocation, key=bus_allocation.get)
        bus_allocation[max_route] += idle_buses  # idle_buses is negative
        idle_buses = 0

    print(f"[DEBUG] Bus Allocation: {bus_allocation}")
    print(f"[DEBUG] Idle Buses: {idle_buses}")

    return {"routes": bus_allocation, "idle_buses": idle_buses}